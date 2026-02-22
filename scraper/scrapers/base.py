"""
Base scraper class with common functionality.
"""

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import json
import time
import random
import re
import hashlib
import os
from datetime import datetime, timedelta
from functools import wraps
from threading import Lock, Semaphore
from typing import List, Dict, Optional, Callable
from dataclasses import dataclass, asdict
from fake_useragent import UserAgent
import sqlite3
from abc import ABC, abstractmethod


@dataclass
class Article:
    """Represents a scraped article."""
    id: str = ""
    portal: str = ""
    title: str = ""
    url: str = ""
    content: str = ""
    lead: str = ""
    author: str = ""
    published_at: str = ""
    category: str = ""
    scraped_at: str = ""
    
    def to_dict(self) -> dict:
        """Convert to dictionary for database/API."""
        # Ensure we have some description
        desc = self.lead or ""
        if not desc and self.content:
            desc = self.content[:500] if len(self.content) > 500 else self.content
        
        return {
            'portal': self.portal,
            'title': self.title,
            'url': self.url,
            'description': desc,
            'content': self.content,
            'published_at': self.published_at,
            'author': self.author,
            'category': self.category
        }


class ResponseCache:
    """Simple SQLite cache for responses."""
    
    def __init__(self, cache_dir: str = ".cache", ttl: int = 300):
        self.cache_dir = cache_dir
        self.ttl = ttl
        os.makedirs(cache_dir, exist_ok=True)
        self.db_path = os.path.join(cache_dir, "cache.db")
        self._init_db()
    
    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS cache (
                    key TEXT PRIMARY KEY,
                    data BLOB,
                    timestamp INTEGER
                )
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_timestamp ON cache(timestamp)
            """)
    
    def _make_key(self, url: str, params: dict = None) -> str:
        key_string = f"{url}:{json.dumps(params, sort_keys=True)}"
        return hashlib.sha256(key_string.encode()).hexdigest()
    
    def get(self, url: str, params: dict = None) -> Optional[dict]:
        key = self._make_key(url, params)
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT data, timestamp FROM cache WHERE key = ?",
                (key,)
            )
            row = cursor.fetchone()
            if row:
                data, timestamp = row
                if time.time() - timestamp < self.ttl:
                    return json.loads(data)
                else:
                    conn.execute("DELETE FROM cache WHERE key = ?", (key,))
        return None
    
    def set(self, url: str, params: dict, data: dict):
        key = self._make_key(url, params)
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO cache (key, data, timestamp) VALUES (?, ?, ?)",
                (key, json.dumps(data), int(time.time()))
            )


class CircuitBreaker:
    """Circuit breaker pattern for fault tolerance."""
    
    def __init__(self, failure_threshold: int = 5, recovery_timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN
        self._lock = Lock()
    
    def call(self, func: Callable, *args, **kwargs):
        with self._lock:
            if self.state == 'OPEN':
                if time.time() - self.last_failure_time > self.recovery_timeout:
                    self.state = 'HALF_OPEN'
                else:
                    raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            with self._lock:
                if self.state == 'HALF_OPEN':
                    self.state = 'CLOSED'
                    self.failure_count = 0
            return result
        except Exception as e:
            with self._lock:
                self.failure_count += 1
                self.last_failure_time = time.time()
                if self.failure_count >= self.failure_threshold:
                    self.state = 'OPEN'
            raise e


class ProxyRotator:
    """Simple proxy rotation."""
    
    def __init__(self, proxy_list: List[str] = None):
        self.proxy_list = proxy_list or []
        self.current_index = 0
    
    def get_proxy(self) -> Optional[dict]:
        if not self.proxy_list:
            return None
        proxy = self.proxy_list[self.current_index]
        self.current_index = (self.current_index + 1) % len(self.proxy_list)
        return {'http': proxy, 'https': proxy}


class BaseScraper(ABC):
    """
    Abstract base class for all scrapers.
    Provides common functionality: session management, retries, caching, etc.
    """
    
    # Portal identifier - must be set by subclasses
    PORTAL_NAME = ""
    BASE_URL = ""
    
    def __init__(
        self,
        proxy_list: List[str] = None,
        use_cache: bool = True,
        cache_ttl: int = 300,
        max_workers: int = 3,
        request_delay: tuple = (1, 3),
        circuit_breaker_threshold: int = 5
    ):
        self.ua = UserAgent(fallback='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
        self.session = self._create_session()
        self.proxy_rotator = ProxyRotator(proxy_list)
        self.cache = ResponseCache(ttl=cache_ttl) if use_cache else None
        self.circuit_breaker = CircuitBreaker(failure_threshold=circuit_breaker_threshold)
        self.max_workers = max_workers
        self.request_delay = request_delay
        self.semaphore = Semaphore(max_workers)
        self.last_request_time = 0
        
        self.stats = {
            'requests': 0,
            'cache_hits': 0,
            'retries': 0,
            'errors': 0
        }
    
    def _create_session(self) -> requests.Session:
        """Create optimized session with retry strategy."""
        session = requests.Session()
        
        retry_strategy = Retry(
            total=5,
            backoff_factor=1.5,
            status_forcelist=[429, 500, 502, 503, 504, 520, 521, 522, 523, 524],
            allowed_methods=["HEAD", "GET", "OPTIONS"],
            raise_on_redirect=False,
            raise_on_status=False
        )
        
        adapter = HTTPAdapter(
            pool_connections=20,
            pool_maxsize=20,
            max_retries=retry_strategy,
            pool_block=False
        )
        
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        
        return session
    
    def _get_headers(self) -> dict:
        """Generate randomized headers."""
        profiles = [
            {
                'sec_ch_ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
                'platform': '"macOS"',
                'mobile': '?0',
            },
            {
                'sec_ch_ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                'platform': '"Windows"',
                'mobile': '?0',
            },
            {
                'sec_ch_ua': '"Not_A Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
                'platform': '"Linux"',
                'mobile': '?0',
            }
        ]
        
        profile = random.choice(profiles)
        user_agent = self.ua.random
        
        # Prefer local Croatian IPs
        accept_lang = random.choice(['hr-HR,hr;q=0.9', 'hr;q=0.9,en;q=0.8', 'en-US,en;q=0.9'])
        
        referers = [
            'https://www.google.com/',
            'https://www.facebook.com/',
            'https://www.index.hr/',
            'https://www.24sata.hr/',
            'https://hr.wikipedia.org/',
            'https://www.tportal.hr/'
        ]
        
        return {
            'User-Agent': user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': accept_lang,
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': random.choice(['none', 'cross-site']),
            'Sec-Fetch-User': '?1',
            'sec-ch-ua': profile['sec_ch_ua'],
            'sec-ch-ua-mobile': profile['mobile'],
            'sec-ch-ua-platform': profile['platform'],
            'Referer': random.choice(referers),
            'Cache-Control': 'max-age=0',
        }
    
    def _apply_delay(self):
        """Apply random delay between requests."""
        min_delay, max_delay = self.request_delay
        elapsed = time.time() - self.last_request_time
        if elapsed < min_delay:
            sleep_time = random.uniform(min_delay, max_delay) - elapsed
            if sleep_time > 0:
                time.sleep(sleep_time)
        self.last_request_time = time.time()
    
    def _make_request(
        self,
        url: str,
        params: dict = None,
        use_cache: bool = True,
        max_retries: int = 3,
        headers: dict = None
    ) -> Optional[requests.Response]:
        """Make request with retry logic and anti-blocking."""
        
        # Check cache
        if use_cache and self.cache:
            cached = self.cache.get(url, params)
            if cached:
                self.stats['cache_hits'] += 1
                resp = requests.Response()
                resp.status_code = 200
                resp._content = json.dumps(cached).encode()
                return resp
        
        self._apply_delay()
        
        for attempt in range(max_retries):
            try:
                request_headers = headers or self._get_headers()
                proxy = self.proxy_rotator.get_proxy()
                
                resp = self.session.get(
                    url,
                    params=params,
                    headers=request_headers,
                    proxies=proxy,
                    timeout=15,
                    allow_redirects=True
                )
                
                self.stats['requests'] += 1
                
                if resp.status_code == 200:
                    if use_cache and self.cache:
                        try:
                            data = resp.json()
                            self.cache.set(url, params, data)
                        except:
                            pass
                    return resp
                
                elif resp.status_code == 429:
                    wait = (2 ** attempt) + random.uniform(0, 1)
                    print(f"[WARN] Rate limited, waiting {wait:.1f}s...")
                    time.sleep(wait)
                    self.stats['retries'] += 1
                
                elif resp.status_code in [500, 502, 503, 504]:
                    if attempt < max_retries - 1:
                        wait = (2 ** attempt) + random.uniform(0, 2)
                        time.sleep(wait)
                        self.stats['retries'] += 1
                
                else:
                    print(f"[WARN] HTTP {resp.status_code} for {url}")
                    self.stats['errors'] += 1
                    return None
                    
            except Exception as e:
                print(f"[ERROR] Request failed: {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)
                    self.stats['retries'] += 1
                else:
                    self.stats['errors'] += 1
                    return None
        
        return None
    
    @abstractmethod
    def fetch_latest(self, limit: int = 50, since_id: str = None, since_time: str = None) -> tuple[List[Article], str]:
        """
        Fetch latest articles.
        
        Args:
            limit: Maximum articles to fetch
            since_id: Last seen article ID for incremental scraping (ID-based)
            since_time: Last seen article timestamp for incremental scraping (time-based)
            
        Returns:
            tuple: (list of new articles, newest article ID or timestamp)
        """
        pass
    
    def scrape(
        self,
        max_articles: int = 200,
        content_filter=None,
        since_id: str = None,
        since_time: str = None
    ) -> tuple[List[dict], str]:
        """
        Main scraping method.
        
        Args:
            max_articles: Maximum articles to fetch
            content_filter: ContentFilter instance (optional)
            since_id: Last seen article ID (for ID-based scrapers)
            since_time: Last seen article timestamp (for time-based scrapers)
            
        Returns:
            tuple: (list of articles as dicts, newest article ID or timestamp)
        """
        # Determine which parameter to use based on scraper type
        if since_time is not None:
            # Time-based scraping (e.g., Jutarnji)
            articles, newest_time = self.fetch_latest(limit=max_articles, since_time=since_time)
            newest = newest_time
        else:
            # ID-based scraping (e.g., Vecernji)
            articles, newest_id = self.fetch_latest(limit=max_articles, since_id=since_id)
            newest = newest_id
        
        # Apply content filter if provided
        if content_filter:
            article_dicts = [art.to_dict() for art in articles]
            accepted, rejected = content_filter.apply_with_log(article_dicts)
            
            if rejected:
                print(f"[FILTER] Rejected {len(rejected)} articles:")
                for r in rejected[:5]:
                    print(f"  ✗ {r['url'][:60]}... ({r['_filter_reason']})")
                if len(rejected) > 5:
                    print(f"  ... and {len(rejected) - 5} more")
            
            return accepted, newest
        
        return [art.to_dict() for art in articles], newest
    
    def print_stats(self):
        """Print statistics."""
        print("\n" + "=" * 50)
        print("SCRAPER STATISTICS")
        print("=" * 50)
        print(f"Total requests:    {self.stats['requests']}")
        print(f"Cache hits:        {self.stats['cache_hits']}")
        print(f"Retries:           {self.stats['retries']}")
        print(f"Errors:            {self.stats['errors']}")
        print(f"Success rate:      {(self.stats['requests'] - self.stats['errors']) / max(self.stats['requests'], 1) * 100:.1f}%")
        print("=" * 50)
    
    def close(self):
        """Close resources."""
        self.session.close()
