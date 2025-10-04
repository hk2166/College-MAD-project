import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe, PantryItem } from '../types';

interface AppContextType {
  pantryItems: PantryItem[];
  addPantryItem: (name: string) => void;
  removePantryItem: (id: string) => void;
  savedRecipes: Recipe[];
  isRecipeSaved: (id: string) => boolean;
  saveRecipe: (recipe: Recipe) => void;
  unsaveRecipe: (id: string) => void;
  currentRecipe: Recipe | null;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  viewSavedRecipe: (recipe: Recipe) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PANTRY: 'culinary-copilot-pantry',
  SAVED_RECIPES: 'culinary-copilot-saved-recipes',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedPantry, storedRecipes] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PANTRY),
        AsyncStorage.getItem(STORAGE_KEYS.SAVED_RECIPES),
      ]);

      if (storedPantry) {
        setPantryItems(JSON.parse(storedPantry));
      }
      if (storedRecipes) {
        setSavedRecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error('Failed to load data from AsyncStorage', error);
    }
    setIsInitialized(true);
  };

  useEffect(() => {
    if (!isInitialized) return;
    savePantryItems();
  }, [pantryItems, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    saveRecipes();
  }, [savedRecipes, isInitialized]);

  const savePantryItems = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(pantryItems));
    } catch (error) {
      console.error('Failed to save pantry to AsyncStorage', error);
    }
  };

  const saveRecipes = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(savedRecipes));
    } catch (error) {
      console.error('Failed to save recipes to AsyncStorage', error);
    }
  };

  const addPantryItem = (name: string) => {
    if (name && !pantryItems.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      setPantryItems((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), name }]);
    }
  };

  const removePantryItem = (id: string) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isRecipeSaved = (id: string) => {
    return savedRecipes.some((recipe) => recipe.id === id);
  };

  const saveRecipe = (recipe: Recipe) => {
    if (!isRecipeSaved(recipe.id)) {
      setSavedRecipes((prev) => [...prev, recipe]);
    }
  };

  const unsaveRecipe = (id: string) => {
    setSavedRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const viewSavedRecipe = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
  };

  const value = {
    pantryItems,
    addPantryItem,
    removePantryItem,
    savedRecipes,
    isRecipeSaved,
    saveRecipe,
    unsaveRecipe,
    currentRecipe,
    setCurrentRecipe,
    viewSavedRecipe,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}