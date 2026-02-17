import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Ingredient {
  name: string;
  category: 'Spirit' | 'Mixer' | 'Fruit' | 'Garnish' | 'Syrup' | 'Other';
  available: boolean;
}

interface BarState {
  barName: string;
  setBarName: (name: string) => void;
  inventory: Ingredient[];
  toggleIngredient: (name: string) => void;
  setInventory: (inventory: Ingredient[]) => void;
  resetInventory: () => void;
  // Pre-populate with common ingredients
  initInventory: () => void;
}

const COMMON_INGREDIENTS: Ingredient[] = [
  { name: 'Vodka', category: 'Spirit', available: true },
  { name: 'Gin', category: 'Spirit', available: true },
  { name: 'Rum', category: 'Spirit', available: true },
  { name: 'Tequila', category: 'Spirit', available: true },
  { name: 'Whiskey', category: 'Spirit', available: true },
  { name: 'Lemon', category: 'Fruit', available: true },
  { name: 'Lime', category: 'Fruit', available: true },
  { name: 'Simple Syrup', category: 'Syrup', available: true },
  { name: 'Soda Water', category: 'Mixer', available: true },
  { name: 'Mint', category: 'Garnish', available: true },
  { name: 'Ice', category: 'Other', available: true },
];

export const useBarStore = create<BarState>()(
  persist(
    (set) => ({
      barName: 'My Home Bar',
      setBarName: (name) => set({ barName: name }),
      inventory: COMMON_INGREDIENTS,
      toggleIngredient: (name) =>
        set((state) => ({
          inventory: state.inventory.map((ing) =>
            ing.name === name ? { ...ing, available: !ing.available } : ing
          ),
        })),
      setInventory: (inventory) => set({ inventory }),
      resetInventory: () => set({ inventory: COMMON_INGREDIENTS }),
      initInventory: () => set((state) => {
        if (state.inventory.length === 0) {
            return { inventory: COMMON_INGREDIENTS };
        }
        return {};
      })
    }),
    {
      name: 'bar-storage',
    }
  )
);
