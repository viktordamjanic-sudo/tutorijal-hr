# 📰 NOVINA Scraper - Dokumentacija

## Sadržaj
1. [Uvod](#uvod)
2. [Arhitektura sustava](#arhitektura-sustava)
3. [Instalacija](#instalacija)
4. [Korištenje](#korištenje)
5. [Konfiguracija](#konfiguracija)
6. [Dodavanje novog portala](#dodavanje-novog-portala)
7. [Tehničke detalje](#tehničke-detalje)
8. [Rješavanje problema](#rješavanje-problema)
9. [Sigurnost i etika](#sigurnost-i-etika)

---

## Uvod

**NOVINA Scraper** je modularni alat za prikupljanje vijesti s više hrvatskih news portala. Razvijen je s naglaskom na:

- ✅ **Modularnost** - Jednostavno dodavanje novih portala
- ✅ **Brzinu** - Interni API (gdje dostupan) omogućuje dohvat 50+ članaka u < 3 sekunde
- ✅ **Pouzdanost** - Circuit breaker, retry logika, caching
- ✅ **Neprimjetnost** - Anti-blocking tehnike, human-like ponašanje
- ✅ **Kvalitetu podataka** - Puni tekst članaka (3,000+ znakova prosječno)

### Podržani portali

| Portal | Metoda | Limit | Opis |
|--------|--------|-------|------|
| **Jutarnji.hr** | JSON API | 200 | Brzo, strukturirani podaci |
| **Večernji.hr** | HTML parsing | 50 | BeautifulSoup parsiranje |

### Glavne značajke

| Značajka | Opis |
|----------|------|
| **Modularna arhitektura** | BaseScraper klasa + portal-specific implementacije |
| **Incremental scraping** | Pamti zadnji ID, ne dohvaća duplikate |
| **Circuit Breaker** | Zaustavlja pokušaje ako server ne odgovara |
| **Response Cache** | SQLite cache sprječava ponavljane requestove |
| **Proxy Support** | Podrška za rotaciju proxyja |
| **Auto-retry** | Exponential backoff s jitterom |

---

## Arhitektura sustava

### Struktura datoteka

```
scraper/
├── main.py                 # Glavni ulazni point
├── scraper.py             # Backward compatibility wrapper
├── config.py              # Konfiguracijske postavke
├── db.py                  # SQLite baza podataka
├── content_filter.py      # Filtriranje sadržaja
├── viewer.py              # Streamlit UI za pregled
├── scrapers/              # Modularni scraper package
│   ├── __init__.py
│   ├── base.py           # BaseScraper apstraktna klasa
│   ├── jutarnji.py       # JutarnjiScraper (JSON API)
│   ├── vecernji.py       # VecernjiScraper (HTML parsing)
│   └── factory.py        # Factory za kreiranje scrapera
├── headlines.db           # SQLite baza (generira se)
├── .cache/                # Cache direktorij (generira se)
│   └── cache.db
└── requirements.txt       # Python dependencies
```

### Dijagram toka

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   main.py   │────▶│ Scraper Factory │────▶│  Portal API     │
│   (CLI)     │     │  (get_scraper)  │     │ (JSON/HTML)     │
└─────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  BaseScraper    │
                    │  - Circuit Br.  │
                    │  - Cache Layer  │
                    │  - Retry Logic  │
                    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   SQLite DB     │
                    │  - headlines    │
                    │  - scrape_state │
                    └─────────────────┘
```

---

## Instalacija

### Preduvjeti

- Python 3.8+
- pip
- (Opcionalno) Virtual environment

### Koraci instalacije

```bash
# 1. Kloniraj repozitorij
git clone <repo-url>
cd scraper

# 2. Kreiraj virtual environment (preporučeno)
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ili: venv\Scripts\activate  # Windows

# 3. Instaliraj ovisnosti
pip install -r requirements.txt

# 4. Testiraj instalaciju
python3 main.py --help
```

### Ovisnosti (requirements.txt)

```
requests==2.32.3          # HTTP requests
beautifulsoup4==4.12.3    # HTML parsing (fallback)
fake-useragent==1.5.1     # Random User-Agent
lxml==5.2.1              # XML/HTML parser
streamlit==1.40.0        # Web UI
pandas==2.2.3            # Data manipulation
```

---

## Korištenje

### Osnovno korištenje

```bash
# Pokreni scraper (svi portali)
python3 main.py

# Samo specifični portal
python3 main.py --portal=jutarnji
python3 main.py --portal=vecernji

# Dry-run (bez spremanja u bazu)
python3 main.py --dry-run

# S punim sadržajem (sporije, za HTML portale)
python3 main.py --portal=vecernji --content
```

### Napredne opcije

```bash
# Postavi limit članaka (config.py)
# PORTALS = {"jutarnji": {"limit": 100}}

# Koristi proxije (dodaj u config.py)
# PROXY_LIST = ["http://proxy1:8080", "http://proxy2:8080"]
```

### Streamlit UI

```bash
# Pokreni web sučelje za pregled
streamlit run viewer.py

# Otvori u pregledniku: http://localhost:8501
```

### Automatsko pokretanje (cron)

```bash
# Uredi crontab
crontab -e

# Dodaj liniju za pokretanje svakih 30 minuta
*/30 * * * * cd /path/to/scraper && python3 main.py >> /var/log/scraper.log 2>&1
```

---

## Konfiguracija

### config.py

```python
import os

# API Token (za slanje na eksterni API)
BEARER_TOKEN = os.getenv("BEARER_TOKEN", "dummy")
API_URL = "https://novina-analysis.novina.workers.dev/import"

# Portali za scraping
PORTALS = {
    "jutarnji": {
        "name": "Jutarnji list",
        "urls": ["https://www.jutarnji.hr/"],
        "limit": 200,              # Max članaka po runu
        "fetch_content": False,     # API vraća puni sadržaj
        "enabled": True,
    },
    "vecernji": {
        "name": "Večernji list", 
        "urls": ["https://www.vecernji.hr/"],
        "limit": 50,               # HTML = sporije
        "fetch_content": True,      # Treba dohvatiti sadržaj
        "enabled": True,
    }
}

# Način rada filtera:
# - "none"     : Bez filtriranja
# - "blacklist": Filtriraj prema EXCLUDE_PATTERNS (default)
# - "whitelist": Samo ALLOW_PATTERNS
FILTER_MODE = os.getenv("FILTER_MODE", "blacklist")

# Predefinirani filter setovi
ACTIVE_FILTER_SETS = os.getenv("ACTIVE_FILTER_SETS", "").split(",")
ACTIVE_FILTER_SETS = [s.strip() for s in ACTIVE_FILTER_SETS if s.strip()]

# Portal-specific filteri
EXCLUDE_PATTERNS = [
    # Jutarnji.hr
    {"pattern": "/domidizajn/", "type": "startswith", "description": "Dizajn"},
    {"pattern": "/scena/", "type": "startswith", "description": "Scena"},
    {"pattern": "/life/", "type": "startswith", "description": "Lifestyle"},
    {"pattern": "/sportske/", "type": "startswith", "description": "Sport"},
]

VECERNJI_EXCLUDE_PATTERNS = [
    # Vecernji.hr specifični
    {"pattern": "/vijesti/lifestyle/", "type": "startswith"},
    {"pattern": "/sport/", "type": "startswith", "description": "Sport"},
    {"pattern": "/native/", "type": "startswith", "description": "Native ads"},
]

# Proxy lista (opcionalno)
PROXY_LIST = []

# Scraper postavke
REQUEST_DELAY = (1, 3)       # Delay između requestova (min, max)
CACHE_TTL = 300              # Cache TTL u sekundama (5 min)
CIRCUIT_BREAKER_THRESHOLD = 5
MAX_WORKERS = 3
```

### Environment Variables

```bash
# Postavi API token
export BEARER_TOKEN="tvoj_token_ovdje"

# Filter mode
export FILTER_MODE="none"           # Bez filtriranja
export FILTER_MODE="blacklist"      # Koristi blacklist
export FILTER_MODE="whitelist"      # Samo whitelist

# Ili u .env datoteci
# echo "BEARER_TOKEN=tvoj_token" > .env
```

---

## Dodavanje novog portala

### 1. Kreiraj scraper klasu

`scrapers/novi_portal.py`:

```python
from typing import List, Tuple
from .base import BaseScraper, Article

class NoviPortalScraper(BaseScraper):
    """
    Scraper za Novi Portal.
    """
    
    PORTAL_NAME = "noviportal"
    BASE_URL = "https://www.noviportal.hr"
    
    def fetch_latest(self, limit: int = 50, since_id: str = None) -> Tuple[List[Article], str]:
        """
        Dohvati najnovije članke.
        
        Returns:
            tuple: (list of articles, newest article ID)
        """
        articles = []
        newest_id = since_id
        
        # Implementacija dohvata (API ili HTML parsing)
        # ...
        
        return articles, newest_id
```

### 2. Registriraj u factory

`scrapers/factory.py`:

```python
from .novi_portal import NoviPortalScraper

SCRAPER_REGISTRY = {
    'jutarnji': JutarnjiScraper,
    'vecernji': VecernjiScraper,
    'noviportal': NoviPortalScraper,  # Dodaj ovdje
}
```

### 3. Dodaj u config

`config.py`:

```python
PORTALS = {
    # ... postojeći portali ...
    
    "noviportal": {
        "name": "Novi Portal",
        "urls": ["https://www.noviportal.hr/"],
        "limit": 50,
        "fetch_content": True,
        "enabled": True,
    }
}

# Dodaj filtere ako treba
NOVIPORTAL_EXCLUDE_PATTERNS = [
    {"pattern": "/lifestyle/", "type": "startswith"},
]
```

### 4. Testiraj

```bash
python3 main.py --portal=noviportal --dry-run
```

---

## Tehničke detalje

### 1. Interni API Jutarnjeg

**Endpoint:** `https://www.jutarnji.hr/index.php?option=com_ocm&view=itemlist&layout=latest&format=json`

**Parametri:**
- `limit=N` - Broj članaka (default: 100)
- `catid=XXX` - ID kategorije (opcionalno)
- `_cb=timestamp` - Cache-busting

**Odgovor:**
```json
{
  "site": {"url": "...", "name": "..."},
  "items": [
    {
      "id": "15670066",
      "title": "...",
      "link": "/vijesti/...",
      "fulltext": "<p>Puni HTML sadržaj...</p>",
      "author": {"name": "...", "link": "..."},
      "publish_up": "2026-02-09 10:00:00"
    }
  ]
}
```

### 2. Incremental Scraping

Scraper pamti `last_article_id` za svaki portal u `scrape_state` tablici:

```sql
SELECT * FROM scrape_state;
-- jutarnji | 15670578 | 2026-02-10 14:02:50
```

Logika:
1. Učitaj `last_article_id` za portal
2. Dohvati nove članke
3. Zaustavi kad naiđeš na `last_article_id`
4. Spremi nove + ažuriraj `last_article_id`

### 3. Anti-blocking mehanizmi

#### Circuit Breaker
```python
# Ako 5 uzastopnih requestova ne uspije:
# - Prelazi u OPEN stanje
# - Ne šalje nove requestove 60 sekundi
# - Zatim HALF_OPEN - testira jedan request
# - Ako uspije, vraća se u CLOSED
```

#### Cache Layer
```python
# Svaki uspješan response se cache-ira u SQLite
# TTL (Time To Live): 300 sekundi (5 min)
# Ključ: SHA256(URL + parametri)
```

#### Retry Strategy
```python
# Exponential backoff: 1.5s, 3s, 6s, 12s...
# + Random jitter: ±0.3s
# Max retries: 5
# Status codes: 429, 500, 502, 503, 504
```

#### Header Rotation
```python
# 3 browser profila se rotiraju:
# 1. Chrome 122 / macOS
# 2. Chrome 120 / Windows  
# 3. Chromium 121 / Linux

# Random User-Agent svaki request
# Random Accept-Language (hr-HR, en-US)
# Random Referer (Google, Facebook, Index.hr...)
```

### 4. Baza podataka

**Tablica: headlines**

| Kolona | Tip | Opis |
|--------|-----|------|
| id | INTEGER PK | Auto-increment ID |
| portal | TEXT | Izvor (npr. "jutarnji", "vecernji") |
| title | TEXT | Naslov članka |
| url | TEXT UNIQUE | URL članka |
| description | TEXT | Puni tekst članka |
| published_at | TEXT | Datum objave |
| author | TEXT | Autor članka |
| scraped_at | TEXT | Vrijeme scrape-a |
| sent_to_api | BOOLEAN | Status slanja |

**Tablica: scrape_state**

| Kolona | Tip | Opis |
|--------|-----|------|
| portal | TEXT PK | Naziv portala |
| last_article_id | TEXT | Zadnji viđeni ID |
| scraped_at | TEXT | Vrijeme zadnjeg scrape-a |

---

## Rješavanje problema

### Problem: "Rate limited" (429)

**Rješenje:**
- Povećaj `request_delay` u config.py: `REQUEST_DELAY=(2, 5)`
- Dodaj proxije u `config.py`
- Smanji `limit` na 25 članaka

### Problem: Prazni rezultati

**Dijagnostika:**
```bash
# Testiraj API direktno
curl -s "https://www.jutarnji.hr/index.php?option=com_ocm&view=itemlist&layout=latest&format=json&limit=5" | python3 -m json.tool
```

**Rješenje:**
- Ako API ne radi, možda su promijenili endpoint
- Provjeri Circuit Breaker status
- Obriši cache: `rm -rf .cache/`

### Problem: Duplikati u bazi

**Provjera:**
```bash
sqlite3 headlines.db "SELECT url, COUNT(*) FROM headlines GROUP BY url HAVING COUNT(*) > 1;"
```

**Rješenje:**
- Baza koristi `UNIQUE` constraint na `url`
- `INSERT OR IGNORE` sprječava duplikate
- Ako ih ima, obriši bazu: `rm headlines.db`

### Problem: Circuit breaker je OPEN

**Rješenje:**
- Pričekaj 60 sekundi (recovery timeout)
- Ili restartaj skriptu

### Problem: Vecernji ne vraća sadržaj

**Rješenje:**
- Provjeri geolocation cookieje: `geoCountry=HR`
- Koristi `--content` flag za puni sadržaj
- Povećaj `request_delay` - HTML parsiranje je sporije

---

## Sigurnost i etika

### Pravila ponašanja

1. **Respect robots.txt** - Kod je isključen, ali razmisli o uključivanju
2. **Ne preopterećuj server** - Default delay (1-3s) je dovoljan
3. **Cacheiraj odgovore** - Smanjuje opterećenje
4. **Ne diži previše threadova** - Max 3 paralelna requesta

### Preporučeni limiti

| Resurs | Preporuka | Razlog |
|--------|-----------|--------|
| Članaka/run | 50-200 | Ovisno o portalu |
| Interval | 15-30 min | Izbjegni rate limiting |
| Cache TTL | 5 min | Balans svježine/brzine |
| Retry delay | 1.5s+ | Izgledaj kao čovjek |

### Legal notice

Scraper je napravljen za **educational/personal use**. Koristi javno dostupne API endpointe i HTML stranice. Ako koristiš za komercijalne svrhe:
- Pročitaj Terms of Service portala
- Kontaktiraj ih za dozvolu
- Ne objavljuj raw sadržaj bez dozvole

---

## API Reference

### Factory funkcije

```python
from scrapers import get_scraper, get_supported_portals

# Dohvati scraper po imenu
scraper = get_scraper('jutarnji')

# Lista podržanih portala
portals = get_supported_portals()  # ['jutarnji', 'vecernji']
```

### BaseScraper klase

```python
from scrapers import BaseScraper, Article

# Kreiraj custom scraper
class MyScraper(BaseScraper):
    PORTAL_NAME = "myportal"
    BASE_URL = "https://www.myportal.hr"
    
    def fetch_latest(self, limit=50, since_id=None):
        # Implementacija
        articles = []
        newest_id = since_id
        # ... dohvati i parsiraj ...
        return articles, newest_id

# Koristi
scraper = MyScraper()
articles, newest_id = scraper.scrape(max_articles=50)
scraper.print_stats()
scraper.close()
```

### Database API

```python
import db

# Spremi članke
db.save_headlines(articles)

# Dohvati neposlane
db.get_unsent_headlines()

# Označi kao poslano
db.mark_sent(articles)

# Statistika
db.get_stats()

# Incremental scraping state
db.get_last_article_id('jutarnji')
db.set_last_article_id('jutarnji', '15670578')
```

---

## Changelog

### v3.0 (2026-02)
- ✅ Modularna arhitektura s BaseScraper klasom
- ✅ Podrška za više portala (Jutarnji, Večernji)
- ✅ Factory pattern za jednostavno dodavanje portala
- ✅ Portal-specific konfiguracija i filteri
- ✅ Incremental scraping s scrape_state tablicom

### v2.0 (2026-02)
- ✅ Prelazak na interni API (10x brže)
- ✅ Dodan Circuit Breaker
- ✅ Dodan Response Cache
- ✅ Puni tekst članaka (3,000+ znakova)

### v1.0 (2024)
- 📝 Inicijalna verzija
- 📝 HTML parsing s BeautifulSoup
- 📝 Basic retry logika

---

## Autor i kontakt

Razvijeno za **NOVINA** projekt.

Za pitanja i prijedloge:
- Email: [tvoj-email]
- GitHub Issues: [repo-url]/issues

---

## Licenca

MIT License - Slobodno koristi, modificiraj i distribuiraj.

**Napomena:** Odgovornost za korištenje je na korisniku. Poštuj pravila i ne zloupotrebljavaj.
