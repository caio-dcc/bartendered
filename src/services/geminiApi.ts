'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { DrinkingManPreferences, DrinkingManResponse } from '@/types';

// Initialize Gemini API
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
});

const GENERATION_CONFIG = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

export async function askDrinkingMan(
  preferences: DrinkingManPreferences,
  locale: string = 'en',
  unavailableIngredients: string[] = [] // Optional: ingredients to EXCLUDE
): Promise<DrinkingManResponse | null> {
  console.log(`[askDrinkingMan] Invoked with locale: ${locale}, blacklist: ${unavailableIngredients.length} items`);
  
  if (!apiKey) {
    console.error('[askDrinkingMan] Gemini API Key is missing');
    return null;
  }

  const languageMap: Record<string, string> = {
    'pt': 'Portuguese (Brazil)',
    'es': 'Spanish',
    'en': 'English'
  };

  const t = locale === 'pt' ? 'portuguese' : locale === 'es' ? 'spanish' : 'english';
  // Use robust mapping or fallback
  const targetLanguage = languageMap[locale] || 'English'; 
  console.log(`[askDrinkingMan] Target Language: ${targetLanguage}`);

  // Construct the inventory constraint string if applicable
  const inventoryConstraint = unavailableIngredients.length > 0
    ? `IMPORTANT: You represent a specific BAR. The following ingredients are OUT OF STOCK: ${unavailableIngredients.join(", ")}. Do NOT suggest a drink that requires these ingredients. If a requested drink typically needs them, suggest a creative substitution or a different drink entirely.`
    : "";

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Act as "DrinkingMan", a sophisticated, witty, and knowledgeable cocktail expert.
    User preferences:
    - Base Spirit: ${preferences.baseSpirit}
    - Flavors: ${preferences.flavorProfile.join(", ")}
    - Occasion: ${preferences.occasion}
    - Mood: ${preferences.mood}
    - Language: ${targetLanguage}

    ${inventoryConstraint}

    Create a unique cocktail recipe based on these preferences.
    Return ONLY a JSON object with this structure:
    {
      "name": "Cocktail Name (Do NOT use markdown, just the name string)",
      "description": "A sophisticated description of the drink, using the persona of DrinkingMan.",
      "ingredients": ["2 oz Spirit", "1 oz Mixer"],
      "instructions": "Step-by-step mixing instructions.",
      "whyItFits": "Why this drink matches the user's mood and occasion.",
      "history": "A fictional or real historical anecdote about the drink or its ingredients.",
      "funFact": "An interesting fact related to the drink.",
      "visualMatch": "A short search term to find a visual match for this drink (e.g. 'Blue Lagoon cocktail')"
    }
    
    IMPORTANT:
    - Write the "description", "whyItFits", "history", "funFact", and "instructions" content strictly in ${targetLanguage}.
    - If the language is Portuguese or Spanish, ALL measurements in "ingredients" MUST be in MILLILITERS (ml). Do not use oz.
    - If the language is Portuguese or Spanish, the "name" of the drink can be translated if appropriate, but do NOT add markdown like *bold*.
    - The "ingredients" list must be in ${targetLanguage}.
    - The "instructions" must be in ${targetLanguage}.
    
    Do not include markdown formatting code blocks. Just raw JSON.
  `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
    });
    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText) as DrinkingManResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}

export async function getCocktailDescription(name: string, ingredients: string[]): Promise<string | null> {
  if (!apiKey) {
    console.error('Gemini API Key is missing');
    return null;
  }

  const prompt = `
    Describe the cocktail "${name}" (Ingredients: ${ingredients.join(', ')}) as if you were Stephen King writing a mysterious, atmospheric, and poetic passage. 
    Focus on the sensory experience—the color, the chill, the bite of the alcohol. 
    Make it captivating and slightly eerie, like a secret whispering in a dimly lit bar.
    Keep it strictly under 100 words. 
    Do not mention Stephen King or say "Here is a description". Just write the text.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        ...GENERATION_CONFIG,
        temperature: 1.0, // High creativity
      },
    });

    return result.response.text();
  } catch (error) {
    console.error('Error getting cocktail description:', error);
    return null;
  }
}

export async function enrichCocktailDetails(name: string, ingredients: string[], locale: string = 'en'): Promise<DrinkingManResponse | null> {
  if (!apiKey) {
    console.error('Gemini API Key is missing');
    return null;
  }

  const languageMap: Record<string, string> = {
    'pt': 'Portuguese (Brazil)',
    'es': 'Spanish',
    'en': 'English'
  };

  const targetLanguage = languageMap[locale] || 'English';

  const prompt = `
    You are DrinkingMan, the sophisticated robot butler mixologist.
    
    I need you to provide your signature entertaining details for the cocktail: "${name}" (Ingredients: ${ingredients.join(', ')}).
    
    Respond strictly in ${targetLanguage}.
    
    Respond in JSON format with the following structure (keys must stay in English, values in ${targetLanguage}):
    {
      "name": "${name}",
      "description": "A sensory, inviting description of the taste and experience.",
      "ingredients": [], 
      "instructions": "",
      "whyItFits": "Explain why this drink is a classic or a great choice in general.",
      "joke": "A dad joke about this drink. - DrinkingMan",
      "funFact": "An interesting historical fact or trivia about this specific cocktail.",
      "history": "The origin story of this cocktail.",
      "visualMatch": "" 
    }
    
    Note: Leave ingredients, instructions, and visualMatch as empty/default strings since we already have them. Focus on the creative fields: description, whyItFits, joke, funFact, history.
    
    Do not include markdown formatting. Just raw JSON.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: GENERATION_CONFIG,
    });

    const response = result.response;
    const text = response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(cleanText) as DrinkingManResponse;
  } catch (error) {
    console.error('Error enriching cocktail details:', error);
    return null;
  }
}
