import requests
from bs4 import BeautifulSoup
import json

r = requests.get("https://www.jutarnji.hr/")
s = BeautifulSoup(r.text, "html.parser")
scripts = s.find_all("script", type="application/ld+json")
print("Total scripts:", len(scripts))
for i, script in enumerate(scripts[:5]):
    if script.string:
        try:
            data = json.loads(script.string)
            print(f"Script {i} type: {data.get('@type')}")
            if data.get("@type") == "ItemList":
                print(f"Items: {len(data.get('itemListElement', []))}")
        except:
            print(f"Script {i}: parse fail")
