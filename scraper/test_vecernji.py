"""
Test scraper za Večernji.hr
Analiza mogućnosti bez unosa u bazu
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime


class VecernjiTestScraper:
    """Test scraper za analizu Večernjeg lista."""
    
    BASE_URL = "https://www.vecernji.hr"
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
    
    def fetch_homepage(self):
        """Dohvati naslovnicu i parsiraj članke."""
        print("📰 Dohvaćam naslovnicu Večernjeg...")
        
        resp = self.session.get(self.BASE_URL, timeout=15)
        resp.raise_for_status()
        
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Pronađi sve članke
        articles = soup.find_all('article', class_='card')
        print(f"✅ Pronađeno {len(articles)} članaka\n")
        
        parsed = []
        for i, art in enumerate(articles[:10], 1):  # Prvih 10 za test
            data = self._parse_article_card(art)
            if data:
                parsed.append(data)
        
        return parsed
    
    def _parse_article_card(self, article_elem):
        """Parsiraj jedan članak iz kartice."""
        try:
            # Link i URL
            link = article_elem.find('a', class_='card__link', href=True)
            if not link:
                return None
            
            url = link['href']
            if not url.startswith('http'):
                url = self.BASE_URL + url
            
            # Naslov
            title_elem = article_elem.find(['h1', 'h2', 'h3', 'h4'], class_='card__title')
            title = title_elem.get_text(strip=True) if title_elem else "N/A"
            
            # Lead (opis)
            lead_elem = article_elem.find('p', class_='card__description')
            lead = lead_elem.get_text(strip=True) if lead_elem else ""
            
            # Kategorija
            cat_elem = article_elem.find('span', class_='card__category')
            category = cat_elem.get_text(strip=True) if cat_elem else ""
            
            # Slika
            img = article_elem.find('img')
            image = img.get('src', '') if img else ""
            
            # Datum (ako postoji)
            time_elem = article_elem.find('time')
            published = time_elem.get('datetime', '') if time_elem else ""
            
            return {
                'title': title,
                'url': url,
                'lead': lead,
                'category': category,
                'image': image,
                'published_at': published
            }
            
        except Exception as e:
            print(f"⚠️ Greška pri parsiranju: {e}")
            return None
    
    def fetch_article_content(self, url):
        """Dohvati puni sadržaj članka."""
        try:
            # Postavi kolačiće za geolokaciju (važno za Večernji)
            self.session.headers.update({
                'Cookie': 'geoCountry=HR; geoCode=HR;'
            })
            
            resp = self.session.get(url, timeout=15, allow_redirects=True)
            resp.raise_for_status()
            
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Naslov - Večernji koristi single-article__title
            title = soup.find('h1', class_='single-article__title')
            if not title:
                title = soup.find('h1', class_='article__title')
            title_text = title.get_text(strip=True) if title else "N/A"
            
            # Lead
            lead = soup.find('p', class_='single-article__description')
            if not lead:
                lead = soup.find('p', class_='article__description')
            lead_text = lead.get_text(strip=True) if lead else ""
            
            # Puni tekst
            content_div = soup.find('div', class_='single-article__content')
            if not content_div:
                content_div = soup.find('div', class_='article__content')
            if content_div:
                paragraphs = content_div.find_all('p')
                content = '\n\n'.join([p.get_text(strip=True) for p in paragraphs])
            else:
                content = ""
            
            # Autor
            author = soup.find('span', class_='single-article__author-name')
            if not author:
                author = soup.find('span', class_='article__author-name')
            author_name = author.get_text(strip=True) if author else ""
            
            # Datum
            time = soup.find('time', class_='single-article__time')
            if not time:
                time = soup.find('time', class_='article__time')
            published = time.get('datetime', '') if time else ""
            
            return {
                'title': title_text,
                'lead': lead_text,
                'content': content,
                'author': author_name,
                'published_at': published
            }
            
        except Exception as e:
            print(f"⚠️ Greška pri dohvatu članka: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def test_scrape(self, full_content=False):
        """Testiraj scraping."""
        print("=" * 70)
        print("🧪 TEST SCRAPER - Večernji.hr")
        print("=" * 70)
        print(f"Vrijeme: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"Mod: {'Puni sadržaj' if full_content else 'Samo naslovnice'}\n")
        
        # 1. Dohvati naslovnicu
        articles = self.fetch_homepage()
        
        if not articles:
            print("❌ Nema pronađenih članaka")
            return
        
        # 2. Prikaži rezultate
        print("📋 PRVIH 5 ČLANAKA:\n")
        for i, art in enumerate(articles[:5], 1):
            print(f"{i}. {art['title'][:70]}...")
            print(f"   URL: {art['url'][:60]}...")
            print(f"   Kategorija: {art['category']}")
            if art['lead']:
                print(f"   Lead: {art['lead'][:100]}...")
            print()
        
        # 3. Test dohvata punog sadržaja (ako je zatraženo)
        if full_content and articles:
            print("=" * 70)
            print("📄 TEST PUNOG SADRŽAJA:\n")
            
            test_url = articles[0]['url']
            print(f"Dohvaćam: {test_url[:70]}...")
            
            content = self.fetch_article_content(test_url)
            if content:
                print(f"\n✅ Naslov: {content['title']}")
                print(f"✅ Autor: {content['author']}")
                print(f"✅ Lead: {content['lead'][:150]}..." if len(content['lead']) > 150 else f"✅ Lead: {content['lead']}")
                print(f"✅ Sadržaj: {len(content['content'])} znakova")
                print(f"\nPrvih 300 znakova sadržaja:")
                print(content['content'][:300])
            else:
                print("❌ Neuspjelo dohvaćanje sadržaja")
        
        # 4. Statistika
        print("\n" + "=" * 70)
        print("📊 STATISTIKA:")
        print("=" * 70)
        print(f"Ukupno pronađeno: {len(articles)} članaka")
        
        # Grupiraj po kategorijama
        by_cat = {}
        for art in articles:
            cat = art['category'] or 'Bez kategorije'
            by_cat[cat] = by_cat.get(cat, 0) + 1
        
        print(f"\nPo kategorijama:")
        for cat, count in sorted(by_cat.items(), key=lambda x: -x[1]):
            print(f"  - {cat}: {count}")


if __name__ == "__main__":
    import sys
    
    # Argument --full za dohvat punog sadržaja
    full = "--full" in sys.argv
    
    scraper = VecernjiTestScraper()
    try:
        scraper.test_scrape(full_content=full)
    except Exception as e:
        print(f"❌ Greška: {e}")
        import traceback
        traceback.print_exc()
