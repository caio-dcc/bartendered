# Component Development Report

This report details the development and purpose of each key component in the DrinkPortfolio application.

## 1. Core Architecture

### `src/app/[locale]/layout.tsx` (Global Layout)

- **Purpose**: Defines the root layout for all pages within the localized routes.
- **Development**:
  - Implements `NextIntlClientProvider` to provide translation context to all client components.
  - Includes the `Navbar` and `Footer` to ensure consistent navigation across the app.
  - Applies global fonts (Montserrat Alternates) and theme variables.

### `src/middleware.ts`

- **Purpose**: Handles internationalized routing.
- **Development**:
  - Configured to detect the user's preferred language or use the default `pt` (Portuguese).
  - Redirects users to the correct locale-prefixed path (e.g., `/` -> `/pt` or `/en`).

---

## 2. Shared Components

### `Navbar.tsx` (`src/components/shared/`)

- **Purpose**: Top navigation bar with language switching.
- **Development**:
  - **Features**: Responsive design with a hamburger menu for mobile.
  - **Language Switcher**: A `Select` component that updates the URL locale when changed.
  - **Styling**: Uses a "wooden" theme (Secondary color background) with white text, as requested for high contrast and aesthetic fit.

### `Footer.tsx` (`src/components/shared/`)

- **Purpose**: Application footer with links and branding.
- **Development**: Simple functional component with social links and copyright info.

---

## 3. Feature Components

### `HeroSection.tsx`

- **Purpose**: The landing area of the Home page.
- **Development**:
  - Features a large, impactful background image with a gradient overlay.
  - Displays the main value proposition: "Crafting the Perfect Sip".
  - Contains calls-to-action to "Ask Drinkboy" or "Browse Cocktails".

### `AboutSection.tsx`

- **Purpose**: Displays the bartender's professional profile (Languages, Certifications, Philosophy).
- **Development**:
  - Uses `framer-motion` for scroll-triggered animations.
  - Displays data in cards with badges for skills.

### `DrinkboyForm.tsx`

- **Purpose**: The interactive AI Sommelier interface.
- **Development**:
  - **State Management**: Uses `useState` to track user preferences (Spirit, Flavor, Occasion, Mood).
  - **Styling**: Custom "wooden" styled Selects for consistent UI.
  - **AI Integration**: Calls `askDrinkboy` (Gemini API) to generate a personalized cocktail recommendation.
  - **Dynamic Visuals**: Fetches real images from TheCocktailDB based on the AI's suggestion to show a "Visual Match".

### `CocktailSearch.tsx`

- **Purpose**: Search bar and filters for the Cocktail Gallery.
- **Development**:
  - Inputs for text search and dropdowns for filtering by Category and Type (Alcoholic/Non-Alcoholic).
  - Emits change events to the parent `CocktailsPage` to update the list.

### `DrinkCard.tsx`

- **Purpose**: Displays a summary of a single cocktail.
- **Development**:
  - **Layout**: Compact card with an image (height `h-32`), name, and brief description (Instructions) _above_ the name.
  - **Interactivity**: Hover effects (zoom) and clickable to view details.
  - **Styling**: White background with wooden-colored text.

---

## 4. Pages

### `CocktailsPage` (`src/app/[locale]/cocktails/page.tsx`)

- **Purpose**: The main gallery browsing experience.
- **Development**:
  - **Data Handling**: Fetches cocktails from TheCocktailDB.
  - **Features**:
    - **Pagination**: Client-side pagination (12 items per page).
    - **Distillates Filter**: Quick-access buttons for Vodka, Gin, etc.
    - **Active Filters**: Displays tags for currently active search/filters with a "Clear" option.
  - **Enrichment**: Fetches full details for displayed items to ensure descriptions are available on the card.

### `CocktailDetailsPage` (`src/app/[locale]/cocktails/[id]/page.tsx`)

- **Purpose**: Detailed view of a specific drink.
- **Development**:
  - **AI Content**: Uses `enrichCocktailDetails` to fetch a "Drinkboy Persona" description (History, Fun Fact, Joke) from Gemini on load.
  - **Layout**: Large hero image, ingredients list, and preparation steps.

---

## 5. Services

### `cocktailApi.ts`

- **Purpose**: Client-side wrapper for TheCocktailDB API.
- **Development**: Provides methods for `searchByName`, `filterByIngredient`, `getDetailsById`, etc.

### `geminiApi.ts`

- **Purpose**: Server-side interface for Google Gemini AI.
- **Development**:
  - `askDrinkboy`: Generates a creative cocktail recipe based on abstract preferences.
  - `enrichCocktailDetails`: Generates lore, history, and jokes for existing cocktails.
