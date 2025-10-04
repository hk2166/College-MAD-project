import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AppContext = createContext(undefined);

const STORAGE_KEYS = {
  PANTRY: 'culinary-copilot-pantry',
  SAVED_RECIPES: 'culinary-copilot-saved-recipes',
};

export function AppProvider({ children }) {
  const [pantryItems, setPantryItems] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
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

  const addPantryItem = (name) => {
    if (name && !pantryItems.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
      setPantryItems((prev) => [...prev, { id: Math.random().toString(36).substr(2, 9), name }]);
    }
  };

  const removePantryItem = (id) => {
    setPantryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isRecipeSaved = (id) => {
    return savedRecipes.some((recipe) => recipe.id === id);
  };

  const saveRecipe = (recipe) => {
    if (!isRecipeSaved(recipe.id)) {
      setSavedRecipes((prev) => [...prev, recipe]);
    }
  };

  const unsaveRecipe = (id) => {
    setSavedRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const viewSavedRecipe = (recipe) => {
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