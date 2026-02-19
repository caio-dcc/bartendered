export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strDrinkAlternate: string | null;
  strTags: string | null;
  strVideo: string | null;
  strCategory: string;
  strIBA: string | null;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  strInstructionsES: string | null;
  strInstructionsDE: string | null;
  strInstructionsFR: string | null;
  strInstructionsIT: string | null;
  strInstructionsPT: string | null;
  strDrinkThumb: string;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
  strIngredient11: string | null;
  strIngredient12: string | null;
  strIngredient13: string | null;
  strIngredient14: string | null;
  strIngredient15: string | null;
  strMeasure1: string | null;
  strMeasure2: string | null;
  strMeasure3: string | null;
  strMeasure4: string | null;
  strMeasure5: string | null;
  strMeasure6: string | null;
  strMeasure7: string | null;
  strMeasure8: string | null;
  strMeasure9: string | null;
  strMeasure10: string | null;
  strMeasure11: string | null;
  strMeasure12: string | null;
  strMeasure13: string | null;
  strMeasure14: string | null;
  strMeasure15: string | null;
  strImageSource: string | null;
  strImageAttribution: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;
  // Enriched Fields
  ingredientsList?: string;
  descriptionPT?: string;
  descriptionES?: string;
  strHistoryEN?: string;
  strHistoryPT?: string;
  strHistoryES?: string;
  strFunFactEN?: string;
  strFunFactPT?: string;
  strFunFactES?: string;
  extraImage1?: string;
  extraImage2?: string;
  extraImage3?: string;
  // Localized Integredients & Measures
  strMeasureML1?: string | null;
  strMeasureML2?: string | null;
  strMeasureML3?: string | null;
  strMeasureML4?: string | null;
  strMeasureML5?: string | null;
  strMeasureML6?: string | null;
  strMeasureML7?: string | null;
  strMeasureML8?: string | null;
  strMeasureML9?: string | null;
  strMeasureML10?: string | null;
  strMeasureML11?: string | null;
  strMeasureML12?: string | null;
  strMeasureML13?: string | null;
  strMeasureML14?: string | null;
  strMeasureML15?: string | null;
  strIngredientPT1?: string | null;
  strIngredientPT2?: string | null;
  strIngredientPT3?: string | null;
  strIngredientPT4?: string | null;
  strIngredientPT5?: string | null;
  strIngredientPT6?: string | null;
  strIngredientPT7?: string | null;
  strIngredientPT8?: string | null;
  strIngredientPT9?: string | null;
  strIngredientPT10?: string | null;
  strIngredientPT11?: string | null;
  strIngredientPT12?: string | null;
  strIngredientPT13?: string | null;
  strIngredientPT14?: string | null;
  strIngredientPT15?: string | null;
  strIngredientES1?: string | null;
  strIngredientES2?: string | null;
  strIngredientES3?: string | null;
  strIngredientES4?: string | null;
  strIngredientES5?: string | null;
  strIngredientES6?: string | null;
  strIngredientES7?: string | null;
  strIngredientES8?: string | null;
  strIngredientES9?: string | null;
  strIngredientES10?: string | null;
  strIngredientES11?: string | null;
  strIngredientES12?: string | null;
  strIngredientES13?: string | null;
  strIngredientES14?: string | null;
  strIngredientES15?: string | null;
}

export interface DrinkingManPreferences {
  baseSpirit: string;
  flavorProfile: string[];
  occasion: string;
  mood: string;
}

export interface DrinkingManResponse {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
  whyItFits: string;
  history?: string;
  funFact?: string;
  visualMatch?: string; // e.g. "Blue Lagoon" if the user wants something blue
}

export interface MoreCocktailInfo {
  history: string;
  funFact: string;
  foodPairings: string[];
  servingTips: string;
  similarDrinks: string[];
}
