"""
Slobodna Dalmacija scraper using JSON-LD structured data.
Parses Schema.org NewsArticle markup from homepage.
Full content fetched via internal API (/api/article/{id}).
"""

import json
import re
from typing import List, Optional, Tuple
from bs4 import BeautifulSoup

try:
    from curl_cffi import requests as curl_requests

    CURL_CFFI_AVAILABLE = True
except ImportError:
    CURL_CFFI_AVAILABLE = False

from .base import BaseScraper, Article


class SlobodnaDalmacijaScraper(BaseScraper):
    """
    Scraper for Slobodna Dalmacija using JSON-LD structured data.
    Parses Schema.org NewsArticle markup from homepage.
    Full content fetched via internal API (bypasses Piano paywall).
    """

    PORTAL_NAME = "slobodnadalmacija"
    BASE_URL = "https://slobodnadalmacija.hr"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def _fetch_article_content(self, article_id: str) -> Tuple[str, str]:
        """
        Fetch full article content via internal API.
        Bypasses Piano paywall by using /api/article/{id} endpoint.
        Uses curl_cffi to bypass Cloudflare protection on the API.

        Returns:
            tuple: (full_content, lead_paragraph)
        """
        if not article_id:
            return "", ""

        if not CURL_CFFI_AVAILABLE:
            print(
                f"[WARN] curl_cffi not available, skipping content fetch for article {article_id}"
            )
            return "", ""

        api_url = f"{self.BASE_URL}/api/article/{article_id}"
        try:
            print(f"[INFO] Fetching full content via API: {api_url}")
            resp = curl_requests.get(api_url, impersonate="chrome120", timeout=30)

            if resp.status_code != 200:
                print(f"[WARN] API returned {resp.status_code}")
                return "", ""

            data = resp.json()
            body_html = data.get("body", "")
            if not body_html:
                print("[WARN] No body in API response")
                return "", ""

            soup = BeautifulSoup(body_html, "html.parser")

            # Extract all paragraphs and headers
            elements = soup.find_all(["p", "h2", "h3", "h4", "li"])

            content_parts = []
            lead = ""

            for elem in elements:
                text = elem.get_text(strip=True)
                if text and len(text) > 10:
                    content_parts.append(text)
                    if not lead and elem.name == "p":
                        lead = text[:300]

            full_content = "\n\n".join(content_parts)
            print(f"[INFO] Fetched {len(full_content)} chars via API")

            return full_content, lead

        except Exception as e:
            print(f"[ERROR] Failed to fetch content via API: {e}")
            return "", ""

        try:
            print(f"[INFO] Fetching full content: {url[:60]}...")
            resp = curl_requests.get(url, impersonate="chrome120", timeout=30)

            if resp.status_code != 200:
                print(f"[WARN] Failed to fetch content: {resp.status_code}")
                return "", ""

            soup = BeautifulSoup(resp.text, "html.parser")

            # Get content from itemFullText
            content_div = soup.find("div", class_="itemFullText")
            if not content_div:
                print(f"[WARN] Content div not found")
                return "", ""

            # Extract all paragraphs and headers
            elements = content_div.find_all(["p", "h2", "h3", "h4", "li"])

            content_parts = []
            lead = ""

            for elem in elements:
                text = elem.get_text(strip=True)
                if text and len(text) > 10:  # Filter out short/empty
                    content_parts.append(text)
                    if not lead and elem.name == "p":
                        lead = text[:300]  # First paragraph as lead

            full_content = "\n\n".join(content_parts)
            print(f"[INFO] Fetched {len(full_content)} chars")

            return full_content, lead

        except Exception as e:
            print(f"[ERROR] Failed to fetch content: {e}")
            return "", ""

    def _get_headers(self) -> dict:
        """Override headers to disable Brotli compression which causes issues."""
        headers = super()._get_headers()
        # Remove Brotli to avoid decompression issues
        headers["Accept-Encoding"] = "gzip, deflate"
        return headers

    def _extract_jsonld_articles(self, html: str) -> List[dict]:
        """Extract articles from JSON-LD structured data."""
        articles = []

        # Parse all JSON-LD scripts
        soup = BeautifulSoup(html, "html.parser")
        scripts = soup.find_all("script", type="application/ld+json")

        for script in scripts:
            try:
                # Use get_text() instead of .string which can be None
                json_text = script.get_text()
                if not json_text:
                    continue

                data = json.loads(json_text)

                # Handle ItemList with articles
                if data.get("@type") == "ItemList" and "itemListElement" in data:
                    for item in data["itemListElement"]:
                        if isinstance(item, dict) and "item" in item:
                            article_data = item["item"]
                            if article_data.get("@type") == "NewsArticle":
                                articles.append(article_data)

                # Handle single NewsArticle
                elif data.get("@type") == "NewsArticle":
                    articles.append(data)

            except (json.JSONDecodeError, AttributeError, KeyError):
                continue

        return articles

    def _parse_article(self, data: dict) -> Optional[Article]:
        """Parse JSON-LD NewsArticle into Article."""
        try:
            # Extract URL from @id or url field
            url = data.get("url", "") or data.get("@id", "")
            if not url.startswith("http"):
                url = f"{self.BASE_URL}{url}"

            # Extract article ID from URL
            article_id = ""
            if "/clanci/" in url:
                article_id = url.split("/clanci/")[-1].split("-")[0]
            elif "-" in url:
                # Last number in URL is usually the ID
                parts = url.split("-")
                for part in reversed(parts):
                    if part.isdigit():
                        article_id = part
                        break

            # Extract headline
            headline = data.get("headline", "")

            # Extract description/lead if available
            description = data.get("description", "")

            # Extract author
            author_data = data.get("author", {})
            if isinstance(author_data, dict):
                author = author_data.get("name", "")
            else:
                author = str(author_data)

            # Extract category from URL path
            category = ""
            url_parts = url.replace(self.BASE_URL, "").split("/")
            if len(url_parts) > 1:
                category = url_parts[1]  # e.g., 'vijesti', 'sport', 'dalmacija'

            return Article(
                id=article_id,
                portal=self.PORTAL_NAME,
                title=headline,
                url=url,
                content=description,  # Will be empty for most, can fetch separately if needed
                lead=description[:300] if description else "",
                author=author,
                published_at=data.get("datePublished", ""),
                category=category,
                scraped_at=__import__("datetime").datetime.now().isoformat(),
            )

        except Exception as e:
            print(f"[WARN] Failed to parse article: {e}")
            return None

    def fetch_latest(
        self,
        limit: int = 50,
        since_id: str = None,
        since_time: str = None,
        fetch_content: bool = False,
    ) -> Tuple[List[Article], str]:
        """
        Fetch latest articles from Slobodna Dalmacija homepage.

        Args:
            limit: Maximum articles to fetch
            since_id: Last seen article ID (for incremental scraping)
            since_time: Last seen article timestamp (ISO format)
            fetch_content: If True, fetch full article content via internal API

        Returns:
            tuple: (list of new articles, newest article ID)
        """
        print(f"[INFO] Fetching latest articles from Slobodna Dalmacija...")
        if fetch_content:
            print(f"[INFO] Full content fetch enabled (using curl_cffi)")

        def fetch():
            resp = self._make_request(self.BASE_URL, use_cache=False)
            if resp:
                return resp.text
            return None

        try:
            html = self.circuit_breaker.call(fetch)
            if not html:
                print("[ERROR] Failed to fetch homepage")
                return [], since_id

            # Extract articles from JSON-LD
            jsonld_articles = self._extract_jsonld_articles(html)
            print(f"[INFO] Found {len(jsonld_articles)} articles in JSON-LD")

            all_articles = []
            newest_id = since_id

            for data in jsonld_articles[:limit]:
                article = self._parse_article(data)
                if article:
                    all_articles.append(article)

                    # Track newest ID
                    if article.id and (
                        not newest_id or int(article.id) > int(newest_id)
                    ):
                        newest_id = article.id

            # Filter by since_id if provided
            new_articles = []
            if since_id:
                for article in all_articles:
                    if article.id and int(article.id) > int(since_id):
                        new_articles.append(article)
            else:
                new_articles = all_articles

            # Sort by ID descending (newest first)
            new_articles.sort(
                key=lambda a: int(a.id) if a.id and a.id.isdigit() else 0, reverse=True
            )

            # Fetch full content if requested
            if fetch_content and new_articles:
                print(
                    f"[INFO] Fetching full content for {len(new_articles)} articles..."
                )
                for article in new_articles:
                    if article.id:
                        full_content, lead = self._fetch_article_content(article.id)
                        if full_content:
                            article.content = full_content
                            if lead and not article.lead:
                                article.lead = lead
                        # Small delay to be polite
                        import time

                        time.sleep(0.5)

            print(
                f"[INFO] Found {len(new_articles)} new articles (out of {len(all_articles)} total)"
            )
            return new_articles, newest_id

        except Exception as e:
            print(f"[ERROR] Circuit breaker or fetch error: {e}")
            return [], since_id

    def scrape(
        self,
        max_articles: int = 200,
        content_filter=None,
        since_id: str = None,
        fetch_content: bool = False,
    ) -> Tuple[List[dict], str]:
        """
        Override scrape to add fetch_content parameter support.
        When fetch_content=True, fetches full text via internal API.
        """
        articles, newest_id = self.fetch_latest(
            limit=max_articles, since_id=since_id, fetch_content=fetch_content
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

    def fetch_article_details(self, article_id: str) -> Optional[Article]:
        """Fetch individual article details (not implemented for now)."""
        # JSON-LD on homepage already has all basic info
        # Could be extended to fetch full content if needed
        return None
