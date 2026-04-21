import os

# ============================================================================
# PORTALI — hrvatski news portali
# ============================================================================

PORTALS = {
    "jutarnji": {
        "name": "Jutarnji list",
        "urls": ["https://www.jutarnji.hr/", "https://www.jutarnji.hr/vijesti"],
        "limit": 200,
        "fetch_content": False,
        "enabled": True,
    },
    "vecernji": {
        "name": "Večernji list",
        "urls": ["https://www.vecernji.hr/"],
        "limit": 50,
        "fetch_content": True,  # Vecernji nema API, treba fetchati content
        "enabled": True,
    },
    "slobodnadalmacija": {
        "name": "Slobodna Dalmacija",
        "urls": ["https://slobodnadalmacija.hr/"],
        "limit": 50,
        "fetch_content": False,
        "enabled": True,
    },
    "telegram": {
        "name": "Telegram.hr",
        "urls": ["https://www.telegram.hr/"],
        "limit": 50,
        "fetch_content": True,  # WP API uvijek vraća puni sadržaj
        "enabled": True,
    },
}

# ============================================================================
# CONTENT FILTER KONFIGURACIJA
# ============================================================================

FILTER_MODE = os.getenv("FILTER_MODE", "blacklist")

ACTIVE_FILTER_SETS = os.getenv("ACTIVE_FILTER_SETS", "").split(",")
ACTIVE_FILTER_SETS = [s.strip() for s in ACTIVE_FILTER_SETS if s.strip()]

# Jutarnji.hr filteri
EXCLUDE_PATTERNS = [
    {
        "pattern": "/domidizajn/",
        "type": "startswith",
        "description": "Dizajn i uređenje doma",
    },
    {"pattern": "/scena/", "type": "startswith", "description": "Scena i estrada"},
    {"pattern": "/life/", "type": "startswith", "description": "Lifestyle"},
    {
        "pattern": "/zdravlje/",
        "type": "startswith",
        "description": "Zdravlje i ljepota",
    },
    {"pattern": "/gastro/", "type": "startswith", "description": "Hrana i piće"},
    {"pattern": "/putovanja/", "type": "startswith", "description": "Putovanja"},
    {"pattern": "/auto/", "type": "startswith", "description": "Automobili"},
    {"pattern": "/web-static/", "type": "startswith", "description": "Oglasni članci"},
    {"pattern": "/promo/", "type": "startswith", "description": "Promo sadržaj"},
]

# Slobodna Dalmacija filteri
SLOBODNADALMACIJA_EXCLUDE_PATTERNS = [
    {"pattern": "/scena/", "type": "startswith", "description": "Scena i zabava"},
    {"pattern": "/mozaik/", "type": "startswith", "description": "Mozaik"},
    {"pattern": "/osmrtnice/", "type": "startswith", "description": "Osmrtnice"},
    {"pattern": "/premium/", "type": "startswith", "description": "Premium članci"},
]

# Večernji.hr filteri
VECERNJI_EXCLUDE_PATTERNS = [
    {"pattern": "/lifestyle/", "type": "startswith", "description": "Lifestyle"},
    {"pattern": "/sport/", "type": "startswith", "description": "Sport"},
    {"pattern": "/native/", "type": "startswith", "description": "Native oglasi"},
    {"pattern": "/promo/", "type": "startswith", "description": "Promo sadržaj"},
    {"pattern": "/zabava/", "type": "startswith", "description": "Zabava"},
    {"pattern": "/magazin/", "type": "startswith", "description": "Magazin"},
]

# Telegram.hr filteri
TELEGRAM_EXCLUDE_PATTERNS = [
    {"pattern": "/telesport/", "type": "startswith", "description": "Telesport"},
    {"pattern": "/super1/", "type": "startswith", "description": "Super1 lifestyle"},
    {"pattern": "/najbolje-na-svijetu/", "type": "startswith", "description": "Zabava"},
    {"pattern": "/bruto-neto/", "type": "startswith", "description": "Bruto-neto"},
]

# Whitelist
ALLOW_PATTERNS = [
    {"pattern": "/vijesti/", "type": "startswith", "description": "Vijesti"},
    {"pattern": "/novac/", "type": "startswith", "description": "Novac i ekonomija"},
    {"pattern": "/komentari/", "type": "startswith", "description": "Komentari"},
]

# ============================================================================
# PROXY KONFIGURACIJA (Opcionalno)
# ============================================================================

PROXY_LIST = []

# ============================================================================
# SCRAPER POSTAVKE
# ============================================================================

REQUEST_DELAY = (1, 3)
CACHE_TTL = 300
CIRCUIT_BREAKER_THRESHOLD = 5
MAX_WORKERS = 3
