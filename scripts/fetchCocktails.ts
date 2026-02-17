
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/cocktails.json');

// Interface to match what we expect
interface Cocktail {
  idDrink: string;
  strDrink: string;
  // ... other fields are dynamic strings
  [key: string]: any; 
}

async function fetchCocktailsByLetter(letter: string): Promise<Cocktail[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/search.php?f=${letter}`);
    return response.data.drinks || [];
  } catch (error) {
    console.error(`Error fetching for letter ${letter}:`, error);
    return [];
  }
}

async function fetchAllCocktails() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
  let allDrinks: Cocktail[] = [];

  console.log('Starting cocktail fetch...');

  for (const char of alphabet) {
    console.log(`Fetching letter: ${char}`);
    const drinks = await fetchCocktailsByLetter(char);
    if (drinks.length > 0) {
      allDrinks = [...allDrinks, ...drinks];
    }
    // Small delay to be polite to the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Remove duplicates just in case
  const uniqueDrinks = Array.from(new Map(allDrinks.map(item => [item.idDrink, item])).values());

  console.log(`Fetched ${uniqueDrinks.length} unique cocktails.`);

  // Ensure directory exists
  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueDrinks, null, 2));
  console.log(`Data written to ${OUTPUT_FILE}`);
}

fetchAllCocktails().catch(console.error);
