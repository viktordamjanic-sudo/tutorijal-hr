// AI Task Generator - Connects news scraper with Claude API
// This module automatically generates educational tasks from scraped news

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.CLAUDE_API_KEY || process.env.CLAUDE_API_KEY,
});

/**
 * Generates educational task from news article
 */
export async function generateTaskFromNews(newsItem: {
  title: string;
  description: string;
  category: string;
}) {
  const prompt = `Na temelju ove vijesti, stvori EDUKATIVNI ZADATAK za web platformu "AI Tutorijal" 
koja uči ljude (djecu i starije) kako koristiti AI asistente za rješavanje stvarnih problema.

VIJEST:
Naslov: ${newsItem.title}
Kategorija: ${newsItem.category}
Sadržaj: ${newsItem.description?.substring(0, 500)}

STVORI ZADATAK U FORMATU JSON:
{
  "title": "Kratki, zanimljivi naslov zadatka",
  "difficulty": "beginner|intermediate|advanced",
  "targetAudience": "kids|seniors|all",
  "scenario": "Opis stvarne situacije iz vijesti",
  "problem": "Koji problem treba riješiti",
  "aiPrompt": "Kako korisnik treba pitati AI (primjer prompta)",
  "expectedOutcome": "Što AI treba generirati",
  "learningPoint": "Koja je glavna lekcija",
  "category": "parking|cooking|language|diplomacy|finance|other"
}

PRAVILA:
1. Scenario mora biti baziran na STVARNOJ vijesti
2. Problem mora biti PRAKTIČAN (ne teorijski)
3. AI prompt treba biti JEDNOSTAVAN i primjenjiv
4. Dodaj malo HUMORA gdje je primjenjivo
5. Uči korisnika KAKO formulirati pitanje AI-ju`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error('AI Task Generation Error:', error);
    return null;
  }
}

/**
 * Generates multiple tasks from batch of news
 */
export async function generateTasksFromNewsBatch(newsItems: Array<{
  title: string;
  description: string;
  category: string;
}>) {
  const tasks = [];
  
  for (const item of newsItems.slice(0, 5)) { // Process top 5 news
    const task = await generateTaskFromNews(item);
    if (task) {
      tasks.push({
        ...task,
        sourceNews: item.title,
        generatedAt: new Date().toISOString(),
      });
    }
  }
  
  return tasks;
}

/**
 * Creates interactive exercise from task
 */
export function createInteractiveExercise(task: any) {
  return {
    id: `task-${Date.now()}`,
    ...task,
    steps: [
      {
        type: 'scenario',
        content: task.scenario,
        media: null,
      },
      {
        type: 'problem',
        content: task.problem,
        hint: 'Razmisli kako bi formulirao pitanje prijatelju...',
      },
      {
        type: 'ai-prompt',
        content: 'Pokušaj sam! Klikni i upiši svoj prompt:',
        example: task.aiPrompt,
      },
      {
        type: 'result',
        content: task.expectedOutcome,
        learningPoint: task.learningPoint,
      },
    ],
  };
}
