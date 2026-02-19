
import { askDrinkingMan } from "../src/services/geminiApi";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // Try .env.local
dotenv.config(); // Fallback to .env

async function testGemini() {
  console.log("Testing Gemini API...");
  console.log("API Key present:", !!process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const preferences = {
    baseSpirit: "Vodka",
    flavorProfile: ["Sweet", "Fruity"],
    occasion: "Party",
    mood: "Happy",
  };

  try {
    const result = await askDrinkingMan(preferences, "en", []);
    if (result) {
      console.log("Success! API returned:", result.name);
    } else {
      console.error("API returned null.");
    }
  } catch (error) {
    console.error("Script Error:", error);
  }
}

testGemini();
