"""
Telegram.hr scraper using WordPress REST API.
Clean, fast, no HTML parsing needed.
"""

import re
from datetime import datetime
from typing import List, Optional, Tuple
from bs4 import BeautifulSoup

from .base import BaseScraper, Article


class TelegramScraper(BaseScraper):
    """
    Scraper for Telegram.hr using WordPress REST API.
    No paywall, no Cloudflare, structured JSON data.
    """

    PORTAL_NAME = "telegram"
    BASE_URL = "https://www.telegram.hr"
    API_BASE = "https://www.telegram.hr/wp-json/wp/v2"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def _get_headers(self) -> dict:
        """Override to avoid gzip issues with WP API."""
        return {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "Accept": "application/json, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "hr-HR,hr;q=0.9",
            "Referer": "https://www.telegram.hr/",
        }

    def _clean_html(self, html: str) -> str:
        """Clean WordPress content HTML: remove ads, banners, empty tags."""
        if not html:
            return ""

        soup = BeautifulSoup(html, "html.parser")

        # Remove ad containers, banners, widgets
        selectors_to_remove = [
            ".banner-slot",
            ".banner-separator",
            ".cxenseignore",
            "#intext_premium",
            "#intext_midas",
            "#piano-content",
            '[id^="telegram_desktop_intext"]',
            '[id^="midas"]',
            ".remove-ads-cta",
        ]
        for selector in selectors_to_remove:
            for elem in soup.select(selector):
                elem.decompose()

        # Remove scripts and styles
        for elem in soup.find_all(["script", "style"]):
            elem.decompose()

        # Get clean text
        text = soup.get_text(separator="\n", strip=True)
        # Clean up excessive newlines
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()

    def _extract_lead(self, html: str) -> str:
        """Extract first paragraph as lead."""
        if not html:
            return ""
        soup = BeautifulSoup(html, "html.parser")
        first_p = soup.find("p")
        if first_p:
            return first_p.get_text(strip=True)[:500]
        return ""

    def _parse_post(self, post: dict) -> Optional[Article]:
        """Parse WordPress REST API post into Article."""
        try:
            post_id = str(post.get("id", ""))
            title = post.get("title", {}).get("rendered", "")
            title = BeautifulSoup(title, "html.parser").get_text(strip=True)

            url = post.get("link", "")
            slug = post.get("slug", "")

            # Date
            date_str = post.get("date", "")
            published = date_str.replace(" ", "T") if date_str else ""

            # Author from embedded data or author ID
            author_name = ""
            if "_embedded" in post and "author" in post["_embedded"]:
                authors = post["_embedded"]["author"]
                if authors and len(authors) > 0:
                    author_name = authors[0].get("name", "")
            if not author_name:
                # Try coauthors from CAP plugin
                coauthors = post.get("coauthors", [])
                if coauthors:
                    # coauthors is list of IDs, we'd need to fetch names
                    pass

            # Categories
            categories = post.get("categories", [])
            category_names = []
            if "_embedded" in post and "wp:term" in post["_embedded"]:
                for term_group in post["_embedded"]["wp:term"]:
                    for term in term_group:
                        if term.get("taxonomy") == "category":
                            category_names.append(term.get("name", ""))
            category = category_names[0] if category_names else ""

            # Content
            content_html = post.get("content", {}).get("rendered", "")
            full_content = self._clean_html(content_html)
            lead = self._extract_lead(content_html)

            # Excerpt fallback
            if not lead:
                excerpt_html = post.get("excerpt", {}).get("rendered", "")
                lead = BeautifulSoup(excerpt_html, "html.parser").get_text(strip=True)[
                    :500
                ]

            return Article(
                id=post_id,
                portal=self.PORTAL_NAME,
                title=title,
                url=url,
                content=full_content,
                lead=lead,
                author=author_name,
                published_at=published,
                category=category,
                scraped_at=datetime.now().isoformat(),
            )

        except Exception as e:
            print(f"[WARN] Failed to parse post: {e}")
            return None

    def fetch_latest(
        self, limit: int = 50, since_id: str = None, since_time: str = None
    ) -> Tuple[List[Article], str]:
        """
        Fetch latest articles via WordPress REST API.

        Args:
            limit: Maximum articles to fetch
            since_id: Last seen post ID
            since_time: Last seen post date (ISO format)

        Returns:
            tuple: (list of new articles, newest post ID)
        """
        print(f"[INFO] Fetching latest {limit} articles from Telegram.hr via WP API...")
        if since_id:
            print(f"[INFO] Looking for articles newer than ID {since_id}")

        api_url = f"{self.API_BASE}/posts"
        params = {
            "per_page": limit,
            "orderby": "date",
            "order": "desc",
            "_embed": "author,wp:term",
        }

        def fetch():
            resp = self._make_request(api_url, params=params, use_cache=False)
            if resp:
                return resp.json()
            return None

        try:
            posts = self.circuit_breaker.call(fetch)
            if not posts or not isinstance(posts, list):
                print("[ERROR] Invalid API response")
                return [], since_id

            all_articles = []
            newest_id = since_id

            for post in posts:
                article = self._parse_post(post)
                if article:
                    all_articles.append(article)
                    if article.id:
                        if not newest_id or int(article.id) > int(newest_id):
                            newest_id = article.id

            # Filter by since_id
            new_articles = []
            if since_id:
                for article in all_articles:
                    if article.id and int(article.id) > int(since_id):
                        new_articles.append(article)
            else:
                new_articles = all_articles

            print(
                f"[INFO] Found {len(new_articles)} new articles (out of {len(all_articles)} total)"
            )
            return new_articles, newest_id

        except Exception as e:
            print(f"[ERROR] API fetch error: {e}")
            import traceback

            traceback.print_exc()
            return [], since_id

    def scrape(
        self,
        max_articles: int = 50,
        content_filter=None,
        since_id: str = None,
        fetch_content: bool = True,
    ) -> Tuple[List[dict], str]:
        """
        Scrape Telegram.hr articles.
        fetch_content is always True since WP API returns full content.
        """
        articles, newest_id = self.fetch_latest(limit=max_articles, since_id=since_id)

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
        """Fetch individual article by ID."""
        try:
            api_url = f"{self.API_BASE}/posts/{article_id}?_embed=author,wp:term"
            resp = self._make_request(api_url, use_cache=False)
            if resp:
                return self._parse_post(resp.json())
            return None
        except Exception as e:
            print(f"[ERROR] Failed to fetch article {article_id}: {e}")
            return None
