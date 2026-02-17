import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load API Key
const envPath = path.join(process.cwd(), '.env.local');
dotenv.config({ path: envPath });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ Could not find NEXT_PUBLIC_GEMINI_API_KEY in .env.local');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const COCKTAILS_FILE = path.join(process.cwd(), 'src/data/cocktails.json');

// Interface for the script
interface Cocktail {
  strDrink: string;
  [key: string]: any;
}

// 2. Define the Prompt Mechanism
async function detailedEnrichment(name: string, ingredients: string[]) {
  const prompt = `
    Act as "DrinkingMan", a sophisticated, witty, and knowledgeable cocktail expert.
    I have a cocktail named "${name}" with ingredients: ${ingredients.join(', ')}.

    I need you to generate ONLY a valid JSON object with the following localized fields.
    
    Fields required:
    - descriptionEN: A sophisticated description in English (max 2 sentences).
    - descriptionPT: A sophisticated description in Portuguese (Brazil) (max 2 sentences).
    - descriptionES: A sophisticated description in Spanish (max 2 sentences).
    - strHistoryEN: A brief origin story or historical context in English.
    - strHistoryPT: A brief origin story or historical context in Portuguese.
    - strHistoryES: A brief origin story or historical context in Spanish.
    - strFunFactEN: A fun or interesting trivia fact in English.
    - strFunFactPT: A fun or interesting trivia fact in Portuguese.
    - strFunFactES: A fun or interesting trivia fact in Spanish.
    - strInstructionsPT: Clear preparation instructions in Portuguese (Imperative mood).
    - strMeasureML[1-15]: Convert original measures to Milliliters (ml) (e.g., "1 oz" -> "30 ml"). Return matching indices.
    - strIngredientPT[1-15]: Translate ingredient names to Portuguese. Return matching indices.
    - strIngredientES[1-15]: Translate ingredient names to Spanish. Return matching indices.

    JSON Structure:
    {
      "descriptionEN": "...",
      "descriptionPT": "...",
      "descriptionES": "...",
      "strHistoryEN": "...",
      "strHistoryPT": "...",
      "strHistoryES": "...",
      "strFunFactEN": "...",
      "strFunFactPT": "...",
      "strFunFactES": "...",
      "strInstructionsPT": "...",
      "strMeasureML1": "...",
      "strMeasureML2": "...",
      "strIngredientPT1": "..."
    }
    
    IMPORTANT:
    - Ensure ALL "strMeasureML" fields are in milliliters (e.g. "30 ml", "60 ml").
    - Ensure descriptionPT, strHistoryPT, strFunFactPT, strInstructionsPT are in proper Portuguese (Brazil).
    - Ensure descriptionES, etc. are in Spanish.
    - Do NOT use markdown. Do NOT use **bold** or *italics* in the JSON values.
    - Do NOT wrap the JSON in markdown code blocks.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error(`Error enriching ${name}:`, error);
    return null;
  }
}

// 3. Main Loop
async function main() {
  console.log('🚀 Starting DrinkingMan Bulk Enrichment...');
  
  if (!fs.existsSync(COCKTAILS_FILE)) {
    console.error('Cocktails file not found.');
    return;
  }

  const cocktailsRaw = fs.readFileSync(COCKTAILS_FILE, 'utf8');
  const cocktails: Cocktail[] = JSON.parse(cocktailsRaw);
  let updatedCount = 0;
  const SAVE_INTERVAL = 5;

  for (let i = 0; i < cocktails.length; i++) {
    const cocktail = cocktails[i];
    
    // Check if we need to enrich (missing description or metric/localized fields)
    const needsEnrichment = 
       !cocktail.descriptionEN || 
       !cocktail.strMeasureML1 || 
       !cocktail.strIngredientPT1 ||
       !cocktail.extraImage1 ||
       !cocktail.extraImage3;

    if (!needsEnrichment) {
      continue;
    }

    console.log(`[${i + 1}/${cocktails.length}] Enriching: ${cocktail.strDrink}...`);

    // Collect ingredients
    const ingredients = [];
    for (let j = 1; j <= 15; j++) {
      const ing = cocktail[`strIngredient${j}`];
      if (ing) ingredients.push(ing);
    }

    // Call API
    const enrichment = await detailedEnrichment(cocktail.strDrink, ingredients);
    
    if (enrichment) {
      // Generate Images (CDN)
      const basePrompt = `${cocktail.strDrink} cocktail drink professional photography 4k high end bar`;
      const img1 = `https://image.pollinations.ai/prompt/${encodeURIComponent(basePrompt)}?n=${Math.random()}`;
      const img2 = `https://image.pollinations.ai/prompt/${encodeURIComponent(cocktail.strDrink + " cocktail close up")}?n=${Math.random()}`;
      const img3 = `https://image.pollinations.ai/prompt/${encodeURIComponent(cocktail.strDrink + " cocktail dark mood")}?n=${Math.random()}`;

      // Merge fields
      Object.assign(cocktail, {
        ...enrichment,
        extraImage1: img1,
        extraImage2: img2,
        extraImage3: img3
      });

      updatedCount++;
      
      // Save periodically
      if (updatedCount % SAVE_INTERVAL === 0) {
        fs.writeFileSync(COCKTAILS_FILE, JSON.stringify(cocktails, null, 2));
        console.log(`💾 Saved progress (${updatedCount} updated)`);
      }
    }
  }

  // Final save
  if (updatedCount > 0) {
    fs.writeFileSync(COCKTAILS_FILE, JSON.stringify(cocktails, null, 2));
    console.log(`✅ Finished! Updated ${updatedCount} cocktails.`);
  } else {
    console.log('✨ No cocktails needed enrichment.');
  }
}

main();
