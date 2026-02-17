import axios from 'axios';
import { Cocktail } from '@/types';

const API_BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export const cocktailApi = {
  searchByName: async (name: string): Promise<Cocktail[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search.php?s=${name}`);
      return response.data.drinks || [];
    } catch (error) {
      console.error('Error searching cocktails:', error);
      return [];
    }
  },

  filterByCategory: async (category: string): Promise<Cocktail[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter.php?c=${category}`);
      return response.data.drinks || [];
    } catch (error) {
      console.error('Error filtering cocktails:', error);
      return [];
    }
  },

  filterByIngredient: async (ingredient: string): Promise<Cocktail[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter.php?i=${ingredient}`);
      return response.data.drinks || [];
    } catch (error) {
      console.error('Error filtering by ingredient:', error);
      return [];
    }
  },

  filterByAlcoholic: async (alcoholic: string): Promise<Cocktail[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/filter.php?a=${alcoholic}`);
      return response.data.drinks || [];
    } catch (error) {
      console.error('Error filtering by alcoholic:', error);
      return [];
    }
  },

  getDetailsById: async (id: string): Promise<Cocktail | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/lookup.php?i=${id}`);
      return response.data.drinks ? response.data.drinks[0] : null;
    } catch (error) {
      console.error('Error getting cocktail details:', error);
      return null;
    }
  },

  getRandomCocktail: async (): Promise<Cocktail | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/random.php`);
      return response.data.drinks ? response.data.drinks[0] : null;
    } catch (error) {
      console.error('Error getting random cocktail:', error);
      return null;
    }
  }
};
