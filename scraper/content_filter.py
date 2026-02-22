"""
Content Filter Module

Fleksibilni sustav za filtriranje članaka prema URL patternima.
Podržava:
- Exact match
- Wildcard patterns (*)
- Regex patterns
- Category-based filtering
"""

import re
from typing import List, Dict, Callable, Optional
from dataclasses import dataclass
from enum import Enum


class FilterType(Enum):
    """Tipovi filtera."""
    EXACT = "exact"           # Tocno podudaranje
    STARTSWITH = "startswith" # Počinje s
    CONTAINS = "contains"     # Sadrži
    WILDCARD = "wildcard"     # Wildcard pattern (*, ?)
    REGEX = "regex"           # Regular expression


@dataclass
class FilterRule:
    """Jedno pravilo filtriranja."""
    pattern: str
    filter_type: FilterType = FilterType.STARTSWITH
    description: str = ""  # Za logging
    active: bool = True
    
    def matches(self, url: str) -> bool:
        """Provjeri podudara li se URL s pravilom."""
        if not self.active:
            return False
            
        if self.filter_type == FilterType.EXACT:
            return url == self.pattern
            
        elif self.filter_type == FilterType.STARTSWITH:
            return url.startswith(self.pattern)
            
        elif self.filter_type == FilterType.CONTAINS:
            return self.pattern in url
            
        elif self.filter_type == FilterType.WILDCARD:
            # Konvertiraj wildcard u regex
            regex_pattern = self.pattern.replace("*", ".*").replace("?", ".")
            return bool(re.search(regex_pattern, url))
            
        elif self.filter_type == FilterType.REGEX:
            try:
                return bool(re.search(self.pattern, url))
            except re.error:
                return False
        
        return False


class ContentFilter:
    """
    Glavna klasa za filtriranje sadržaja.
    
    Primjer korištenja:
        filter = ContentFilter()
        filter.add_rule("/domidizajn/", FilterType.STARTSWITH, "Dizajn sekcija")
        filter.add_rule(".*auto.*", FilterType.REGEX, "Auto tematika")
        
        filtered = filter.apply(articles)
    """
    
    def __init__(self):
        self.rules: List[FilterRule] = []
        self.stats = {
            "total_checked": 0,
            "filtered_out": 0,
            "by_rule": {}
        }
    
    def add_rule(
        self, 
        pattern: str, 
        filter_type: FilterType = FilterType.STARTSWITH,
        description: str = ""
    ) -> "ContentFilter":
        """
        Dodaj pravilo filtriranja.
        
        Args:
            pattern: Pattern za podudaranje
            filter_type: Vrsta podudaranja
            description: Opis za logging
            
        Returns:
            self (za chaining)
        """
        rule = FilterRule(
            pattern=pattern,
            filter_type=filter_type,
            description=description or f"Filter: {pattern}"
        )
        self.rules.append(rule)
        self.stats["by_rule"][description or pattern] = 0
        return self
    
    def add_rules_from_config(self, config: List[Dict]):
        """
        Dodaj više pravila iz konfiguracije.
        
        Args:
            config: Lista dictova s ključevima:
                   - pattern (str)
                   - type (str: exact/startswith/contains/wildcard/regex)
                   - description (str, optional)
        """
        type_map = {
            "exact": FilterType.EXACT,
            "startswith": FilterType.STARTSWITH,
            "contains": FilterType.CONTAINS,
            "wildcard": FilterType.WILDCARD,
            "regex": FilterType.REGEX,
        }
        
        for item in config:
            filter_type = type_map.get(item.get("type", "startswith"), FilterType.STARTSWITH)
            self.add_rule(
                pattern=item["pattern"],
                filter_type=filter_type,
                description=item.get("description", "")
            )
    
    def _extract_path(self, url: str) -> str:
        """Izdvoji path iz punog URL-a."""
        # Remove protocol and domain
        if '://' in url:
            url = url.split('://', 1)[1]
        if '/' in url:
            url = '/' + url.split('/', 1)[1]
        return url
    
    def should_filter(self, url: str) -> tuple[bool, Optional[str]]:
        """
        Provjeri treba li filtrirati URL.
        
        Args:
            url: Puni URL (https://...) ili samo path (/...)
            
        Returns:
            Tuple: (should_filter, reason)
        """
        self.stats["total_checked"] += 1
        
        # Extract path from full URL if needed
        path = self._extract_path(url)
        
        for rule in self.rules:
            # Try matching against both full URL and path
            if rule.matches(url) or rule.matches(path):
                self.stats["filtered_out"] += 1
                reason = rule.description or rule.pattern
                self.stats["by_rule"][reason] = self.stats["by_rule"].get(reason, 0) + 1
                return True, reason
        
        return False, None
    
    def apply(self, articles: List[Dict]) -> List[Dict]:
        """
        Primijeni filtere na listu članaka.
        
        Args:
            articles: Lista članaka (dictova s 'url' ključem)
            
        Returns:
            Filtrirana lista članaka
        """
        filtered = []
        
        for article in articles:
            url = article.get("url", "")
            should_filter, reason = self.should_filter(url)
            
            if should_filter:
                # Log the filtering
                article["_filtered"] = True
                article["_filter_reason"] = reason
            else:
                filtered.append(article)
        
        return filtered
    
    def apply_with_log(self, articles: List[Dict]) -> tuple[List[Dict], List[Dict]]:
        """
        Primijeni filtere i vrati i filtrirane i ne-filtrirane.
        
        Returns:
            Tuple: (accepted, rejected)
        """
        accepted = []
        rejected = []
        
        for article in articles:
            url = article.get("url", "")
            should_filter, reason = self.should_filter(url)
            
            if should_filter:
                article["_filtered"] = True
                article["_filter_reason"] = reason
                rejected.append(article)
            else:
                accepted.append(article)
        
        return accepted, rejected
    
    def get_stats(self) -> Dict:
        """Vrati statistiku filtriranja."""
        return {
            "total_rules": len(self.rules),
            "total_checked": self.stats["total_checked"],
            "filtered_out": self.stats["filtered_out"],
            "pass_rate": (
                (self.stats["total_checked"] - self.stats["filtered_out"]) / 
                max(self.stats["total_checked"], 1) * 100
            ),
            "by_rule": self.stats["by_rule"]
        }
    
    def print_stats(self):
        """Ispiši statistiku."""
        stats = self.get_stats()
        print("\n" + "=" * 60)
        print("CONTENT FILTER STATISTICS")
        print("=" * 60)
        print(f"Total rules:     {stats['total_rules']}")
        print(f"Checked:         {stats['total_checked']}")
        print(f"Filtered out:    {stats['filtered_out']}")
        print(f"Pass rate:       {stats['pass_rate']:.1f}%")
        print("\nBy rule:")
        for rule, count in stats["by_rule"].items():
            if count > 0:
                print(f"  - {rule}: {count}")
        print("=" * 60)
    
    def reset_stats(self):
        """Resetiraj statistiku."""
        self.stats = {
            "total_checked": 0,
            "filtered_out": 0,
            "by_rule": {k: 0 for k in self.stats["by_rule"]}
        }


# Predefinirani filteri za Jutarnji.hr
class JutarnjiFilters:
    """Predefinirani filteri za Jutarnji.hr."""
    
    @staticmethod
    def lifestyle_filter() -> ContentFilter:
        """Filtriraj lifestyle sadržaj (/domidizajn, /scena, etc)."""
        cf = ContentFilter()
        cf.add_rule("/domidizajn/", FilterType.STARTSWITH, "Dizajn i uređenje")
        cf.add_rule("/scena/", FilterType.STARTSWITH, "Scena i zvijezde")
        cf.add_rule("/life/", FilterType.STARTSWITH, "Lifestyle")
        cf.add_rule("/zdravlje/", FilterType.STARTSWITH, "Zdravlje i ljepota")
        cf.add_rule("/gastro/", FilterType.STARTSWITH, "Hrana i piće")
        return cf
    
    @staticmethod
    def sports_filter() -> ContentFilter:
        """Filtriraj sportske sadržaje."""
        cf = ContentFilter()
        cf.add_rule("/sn/", FilterType.STARTSWITH, "Sportske novosti")
        cf.add_rule("/nogomet/", FilterType.STARTSWITH, "Nogomet")
        cf.add_rule("/kosarka/", FilterType.STARTSWITH, "Košarka")
        cf.add_rule("/tenis/", FilterType.STARTSWITH, "Tenis")
        return cf
    
    @staticmethod
    def only_news() -> ContentFilter:
        """Samo vijesti (/vijesti/*)."""
        cf = ContentFilter()
        # Invert logic - allow only /vijesti/
        # This is complex, better to filter after fetching
        cf.add_rule("/vijesti/", FilterType.STARTSWITH, "Vijesti (allowed)")
        return cf


# Factory funkcija
def create_filter_from_names(names: List[str]) -> ContentFilter:
    """
    Kreiraj filter prema imenima predefiniranih filtera.
    
    Args:
        names: Lista imena ("lifestyle", "sports", etc.)
        
    Returns:
        ContentFilter instance
    """
    cf = ContentFilter()
    
    factories = {
        "lifestyle": JutarnjiFilters.lifestyle_filter,
        "sports": JutarnjiFilters.sports_filter,
    }
    
    for name in names:
        if name in factories:
            # Merge rules from predefined filter
            predefined = factories[name]()
            cf.rules.extend(predefined.rules)
    
    return cf


if __name__ == "__main__":
    # Test
    cf = ContentFilter()
    cf.add_rule("/domidizajn/", FilterType.STARTSWITH, "Dizajn")
    cf.add_rule(".*auto.*", FilterType.REGEX, "Auto tematika")
    
    test_articles = [
        {"url": "/vijesti/hrvatska/test", "title": "Vijest"},
        {"url": "/domidizajn/inspiracije/test", "title": "Dizajn"},
        {"url": "/vijesti/auto/test", "title": "Auto vijest"},
    ]
    
    accepted, rejected = cf.apply_with_log(test_articles)
    
    print("ACCEPTED:")
    for a in accepted:
        print(f"  ✓ {a['url']}")
    
    print("\nREJECTED:")
    for r in rejected:
        print(f"  ✗ {r['url']} ({r['_filter_reason']})")
    
    cf.print_stats()
