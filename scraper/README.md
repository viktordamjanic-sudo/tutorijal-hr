# 📰 NOVINA Scraper

Modularni scraper za hrvatske news portale. Podržava više portala s jedinstvenom bazom i konfiguracijom.

## 🚀 Quick Start

```bash
# Instalacija
pip install -r requirements.txt

# Pokreni sve portale
python main.py

# Samo jedan portal
python main.py --portal=jutarnji
python main.py --portal=vecernji

# Test bez spremanja
python main.py --dry-run
```

## 📋 Podržani portali

| Portal | Metoda | Brzina | Opis |
|--------|--------|--------|------|
| **Jutarnji.hr** | JSON API | ⚡⚡⚡ | Interni API, strukturirani podaci |
| **Večernji.hr** | HTML | ⚡⚡ | BeautifulSoup parsiranje |

## 🏗️ Arhitektura

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐
│ main.py │────▶│   Factory   │────▶│ BaseScraper │
└─────────┘     │(get_scraper)│     │  + Portal   │
                └─────────────┘     └─────────────┘
                                             │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                        ┌─────────┐    ┌─────────┐    ┌──────────┐
                        │Jutarnji │    │Vecernji │    │ Novi...  │
                        └─────────┘    └─────────┘    └──────────┘
```

## ⚙️ Konfiguracija

`config.py`:
```python
PORTALS = {
    "jutarnji": {
        "name": "Jutarnji list",
        "limit": 200,
        "fetch_content": False,
        "enabled": True,
    },
    "vecernji": {
        "name": "Večernji list",
        "limit": 50,
        "fetch_content": True,
        "enabled": True,
    }
}
```

## ➕ Dodavanje novog portala

1. **Kreiraj scraper** (`scrapers/novi_portal.py`):
```python
from .base import BaseScraper, Article

class NoviPortalScraper(BaseScraper):
    PORTAL_NAME = "noviportal"
    BASE_URL = "https://www.noviportal.hr"
    
    def fetch_latest(self, limit=50, since_id=None):
        # Implementacija...
        return articles, newest_id
```

2. **Registriraj** u `scrapers/factory.py`:
```python
from .novi_portal import NoviPortalScraper
SCRAPER_REGISTRY['noviportal'] = NoviPortalScraper
```

3. **Dodaj u config** (`config.py`):
```python
PORTALS = {
    "noviportal": {
        "name": "Novi Portal",
        "limit": 50,
        "enabled": True,
    }
}
```

4. **Testiraj**:
```bash
python main.py --portal=noviportal --dry-run
```

## 📊 Pregled baze

```bash
streamlit run viewer.py
# Otvori: http://localhost:8501
```

## 📝 Značajke

- ✅ **Modularna arhitektura** - Jednostavno dodavanje portala
- ✅ **Incremental scraping** - Pamti zadnji ID, ne dohvaća duplikate  
- ✅ **Multi-portal** - Jutarnji, Večernji, i lako dodati još
- ✅ **Circuit Breaker** - Zaštita od preopterećenja
- ✅ **Content Filter** - Filtriranje po kategorijama
- ✅ **SQLite storage** - Lokalna baza s scrape_state

## 📖 Dokumentacija

Detaljna dokumentacija: [DOKUMENTACIJA.md](DOKUMENTACIJA.md)

## ⚖️ Licenca

MIT License - Slobodno koristi, modificiraj i distribuiraj.

**Napomena:** Odgovornost za korištenje je na korisniku. Poštuj pravila portala.
