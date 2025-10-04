'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { PantryItem, Recipe } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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

const LOCAL_STORAGE_KEYS = {
  PANTRY: 'culinary-copilot-pantry',
  SAVED_RECIPES: 'culinary-copilot-saved-recipes',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPantry = localStorage.getItem(LOCAL_STORAGE_KEYS.PANTRY);
      if (storedPantry) {
        setPantryItems(JSON.parse(storedPantry));
      }
      const storedRecipes = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVED_RECIPES);
      if (storedRecipes) {
        setSavedRecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
      toast({
        title: 'Error',
        description: 'Could not load your saved data.',
        variant: 'destructive',
      });
    }
    setIsInitialized(true);
  }, [toast]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PANTRY, JSON.stringify(pantryItems));
    } catch (error) {
      console.error('Failed to save pantry to localStorage', error);
    }
  }, [pantryItems, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SAVED_RECIPES, JSON.stringify(savedRecipes));
    } catch (error)      {
      console.error('Failed to save recipes to localStorage', error);
    }
  }, [savedRecipes, isInitialized]);

  const addPantryItem = (name: string) => {
    if (name && !pantryItems.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      setPantryItems((prev) => [...prev, { id: crypto.randomUUID(), name }]);
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
      toast({
        title: 'Recipe Saved!',
        description: `${recipe.recipeName} has been added to your collection.`,
      });
    }
  };

  const unsaveRecipe = (id: string) => {
    setSavedRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    toast({
      title: 'Recipe Unsaved',
      description: `The recipe has been removed from your collection.`,
    });
  };

  const viewSavedRecipe = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    // Note: Navigation will be handled in the component that calls this
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
