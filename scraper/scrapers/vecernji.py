"""
Vecernji.hr scraper using HTML parsing.
No public JSON API available, uses BeautifulSoup.
"""

import json
import re
import time
from typing import List, Optional, Tuple
from bs4 import BeautifulSoup
from urllib.parse import urljoin

from .base import BaseScraper, Article


class VecernjiScraper(BaseScraper):
    """
    Scraper for Vecernji.hr using HTML parsing.
    Slower than JSON API but works for sites without public APIs.
    """
    
    PORTAL_NAME = "vecernji"
    BASE_URL = "https://www.vecernji.hr"
    
    # CSS selectors for article cards
    ARTICLE_CARD_SELECTOR = 'article.card'
    TITLE_SELECTOR = '.card__title'
    LINK_SELECTOR = '.card__link'
    DESCRIPTION_SELECTOR = '.card__description'
    CATEGORY_SELECTOR = '.card__category'
    TIME_SELECTOR = 'time'
    IMAGE_SELECTOR = 'img'
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Vecernji needs geolocation cookies
        self.session.headers.update({
            'Cookie': 'geoCountry=HR; geoCode=HR;'
        })
    
    def _parse_article_card(self, article_elem) -> Optional[Article]:
        """Parse article card from HTML element."""
        try:
            # Link and URL
            link = article_elem.find('a', class_='card__link', href=True)
            if not link:
                return None
            
            url = link['href']
            if not url.startswith('http'):
                url = urljoin(self.BASE_URL, url)
            
            # Extract article ID from URL if possible
            # Vecernji URLs: https://www.vecernji.hr/.../article-slug-12345678
            article_id = ""
            url_match = re.search(r'-(\d+)$', url.split('?')[0])
            if url_match:
                article_id = url_match.group(1)
            else:
                # Use URL hash as fallback ID
                import hashlib
                article_id = hashlib.md5(url.encode()).hexdigest()[:12]
            
            # Title
            title_elem = article_elem.find(['h1', 'h2', 'h3', 'h4'], class_='card__title')
            title = title_elem.get_text(strip=True) if title_elem else ""
            
            if not title:
                return None
            
            # Lead (description)
            lead_elem = article_elem.find('p', class_='card__description')
            lead = lead_elem.get_text(strip=True) if lead_elem else ""
            
            # Category
            cat_elem = article_elem.find('span', class_='card__category')
            category = cat_elem.get_text(strip=True) if cat_elem else ""
            
            # Published date
            time_elem = article_elem.find('time')
            published = time_elem.get('datetime', '') if time_elem else ""
            
            return Article(
                id=article_id,
                portal=self.PORTAL_NAME,
                title=title,
                url=url,
                content=lead,  # Will be updated if full content fetched
                lead=lead,
                author="",  # Not available in card, needs article page
                published_at=published,
                category=category,
                scraped_at=__import__('datetime').datetime.now().isoformat()
            )
            
        except Exception as e:
            print(f"[WARN] Error parsing article card: {e}")
            return None
    
    def _fetch_article_details(self, url: str) -> Tuple[str, str, str, str]:
        """
        Fetch full article content, author and date from article page.
        
        Returns:
            tuple: (full_content, lead, author, published_at)
        """
        try:
            resp = self._make_request(url, use_cache=True, max_retries=2)
            if not resp:
                return "", "", "", ""
            
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Title
            title = soup.find('h1', class_='single-article__title')
            if not title:
                title = soup.find('h1', class_='article__title')
            
            # Lead
            lead_elem = soup.find('p', class_='single-article__description')
            if not lead_elem:
                lead_elem = soup.find('p', class_='article__description')
            lead = lead_elem.get_text(strip=True) if lead_elem else ""
            
            # Full content
            content_div = soup.find('div', class_='single-article__content')
            if not content_div:
                content_div = soup.find('div', class_='article__content')
            
            content = ""
            if content_div:
                # Remove unwanted elements (but keep structure)
                for elem in content_div.find_all(['script', 'style', 'iframe', 'aside']):
                    elem.decompose()
                
                # Get all paragraphs
                paragraphs = content_div.find_all('p')
                
                # Filter: skip related article cards and empty paragraphs
                valid_paragraphs = []
                for p in paragraphs:
                    # Check if this p is inside a card or related article widget
                    parent = p.find_parent(['article', 'div'])
                    parent_classes = ' '.join(parent.get('class', [])) if parent else ''
                    
                    if 'card' in parent_classes.lower():
                        continue  # Skip related article cards
                    if 'widgetWrap' in parent_classes.lower():
                        continue  # Skip widgets
                    if 'single-article__row' in parent_classes.lower() and 'related' in str(p):
                        continue  # Skip related rows
                    
                    text = p.get_text(strip=True)
                    if text and len(text) > 20:  # Skip very short snippets
                        valid_paragraphs.append(text)
                
                content = '\n\n'.join(valid_paragraphs)
                
                # If no lead found, use first paragraph as lead
                if not lead and valid_paragraphs:
                    lead = valid_paragraphs[0]
            
            # Extract author and date from JavaScript (defractalPage)
            author_name = ""
            published_at = ""
            
            for script in soup.find_all('script'):
                if script.string and 'defractalPage' in script.string:
                    match = re.search(r'var defractalPage = ({.+?});', script.string, re.DOTALL)
                    if match:
                        try:
                            data = json.loads(match.group(1))
                            authors = data.get('authors', [])
                            if authors:
                                author_name = authors[0]
                            published_at = data.get('date', '')
                        except:
                            pass
                    break
            
            # Fallback: extract from HTML if not found in JS
            if not author_name:
                author_selectors = [
                    'div.author__name',
                    'span.single-article__author-name',
                    'span.article__author-name',
                    'a.single-article__author-name',
                    '.author-name',
                ]
                for sel in author_selectors:
                    author = soup.select_one(sel)
                    if author:
                        author_name = author.get_text(strip=True)
                        if author_name:
                            break
            
            # Clean up author name - remove "VLAutor" and "Autor" prefixes
            author_name = re.sub(r'^(VL)?Autor', '', author_name).strip()
            
            return content, lead, author_name, published_at
            
        except Exception as e:
            print(f"[WARN] Error fetching article content: {e}")
            return "", "", "", ""
    
    def fetch_latest(self, limit: int = 50, since_id: str = None, since_time: str = None, fetch_content: bool = True) -> Tuple[List[Article], str]:
        """
        Fetch latest articles from homepage.
        
        Args:
            limit: Maximum articles to fetch
            since_id: Last seen article ID for incremental scraping
            since_time: Not used for Vecernji (ID-based)
            fetch_content: Whether to fetch full content (slower)
            
        Returns:
            tuple: (list of new articles, newest article ID)
        """
        print(f"[INFO] Fetching latest {limit} articles from Vecernji homepage...")
        if since_id:
            print(f"[INFO] Looking for articles newer than ID {since_id}")
        
        def fetch():
            resp = self._make_request(
                self.BASE_URL,
                use_cache=False
            )
            if resp:
                return resp.text
            return None
        
        try:
            html = self.circuit_breaker.call(fetch)
            if not html:
                print("[ERROR] Failed to fetch homepage")
                return [], since_id
            
            soup = BeautifulSoup(html, 'html.parser')
            article_cards = soup.find_all('article', class_='card')
            
            print(f"[INFO] Found {len(article_cards)} article cards")
            
            articles = []
            newest_id = since_id
            
            for card in article_cards[:limit]:
                article = self._parse_article_card(card)
                if not article:
                    continue
                
                # Stop when we reach already seen article
                if since_id and article.id == since_id:
                    print(f"[INFO] Found last seen article {since_id}, stopping")
                    break
                
                # Track newest ID (numeric comparison if possible)
                if article.id and article.id != since_id:
                    if not newest_id:
                        newest_id = article.id
                    elif article.id.isdigit() and newest_id.isdigit():
                        if int(article.id) > int(newest_id):
                            newest_id = article.id
                    else:
                        # For non-numeric IDs, just take first as newest
                        pass
                
                # Fetch full content if requested
                if fetch_content and article.url:
                    print(f"[INFO] Fetching content for: {article.title[:50]}...")
                    content, lead, author, published_at = self._fetch_article_details(article.url)
                    if content:
                        article.content = content
                    if lead:
                        article.lead = lead
                    if author:
                        article.author = author
                    if published_at:
                        article.published_at = published_at
                
                articles.append(article)
            
            print(f"[INFO] Successfully fetched {len(articles)} new articles")
            return articles, newest_id
            
        except Exception as e:
            print(f"[ERROR] Circuit breaker or fetch error: {e}")
            import traceback
            traceback.print_exc()
            return [], since_id
    
    def scrape(self, max_articles: int = 50, content_filter=None, since_id: str = None, fetch_content: bool = True) -> Tuple[List[dict], str]:
        """
        Override scrape to add fetch_content parameter.
        """
        articles, newest_id = self.fetch_latest(
            limit=max_articles,
            since_id=since_id,
            fetch_content=fetch_content
        )
        
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
            
            return accepted, newest_id
        
        return [art.to_dict() for art in articles], newest_id
