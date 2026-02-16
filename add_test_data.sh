#!/bin/bash
# Add test data to Convex via dashboard

echo "To add test data:"
echo "1. Open https://dashboard.convex.dev/d/efficient-antelope-653"
echo "2. Go to 'Data' tab"
echo "3. Click 'tasks' table"
echo "4. Add document with:"
cat <> 'JSON'
{
  "title": "🚗 Parking Hero - Test",
  "icon": "🚗",
  "scenario": "Susjed parkira na tvom mjestu",
  "problem": "Kako ga ljubazno zamoliti da pomakne auto?",
  "aiPrompt": "Napiši ljubaznu poruku susjedu...",
  "expectedOutcome": "Pristojna poruka spremna za slanje",
  "learningPoint": "AI je preveditelj emocija",
  "difficulty": "beginner",
  "targetAudience": "seniors",
  "category": "parking",
  "isActive": true,
  "generatedAt": 1708080000000
}
JSON

echo ""
echo "Or use Convex dashboard UI to add manually"
