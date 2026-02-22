import os

# ============================================================================
# API KONFIGURACIJA
# ============================================================================

BEARER_TOKEN = os.getenv("BEARER_TOKEN", "dummy")
API_URL = "https://novina-analysis.novina.workers.dev/import"

# ============================================================================
# PORTALI — samo Jutarnji list
# ============================================================================

PORTALS = {
    "jutarnji": {
        "name": "Jutarnji list",
        "urls": ["https://www.jutarnji.hr/", "https://www.jutarnji.hr/vijesti"],
        "limit": 200,
        "fetch_content": False,
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
    {"pattern": "/domidizajn/", "type": "startswith", "description": "Dizajn i uređenje doma"},
    {"pattern": "/scena/", "type": "startswith", "description": "Scena i estrada"},
    {"pattern": "/life/", "type": "startswith", "description": "Lifestyle"},
    {"pattern": "/zdravlje/", "type": "startswith", "description": "Zdravlje i ljepota"},
    {"pattern": "/gastro/", "type": "startswith", "description": "Hrana i piće"},
    {"pattern": "/putovanja/", "type": "startswith", "description": "Putovanja"},
    {"pattern": "/auto/", "type": "startswith", "description": "Automobili"},
    {"pattern": "/web-static/", "type": "startswith", "description": "Oglasni članci"},
    {"pattern": "/promo/", "type": "startswith", "description": "Promo sadržaj"},
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
