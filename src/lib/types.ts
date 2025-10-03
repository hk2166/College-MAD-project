import type { GenerateRecipeFromIngredientsOutput } from '@/ai/flows/generate-recipe-from-ingredients';

export type Recipe = GenerateRecipeFromIngredientsOutput & {
  id: string;
  imageUrl: string;
  imageHint: string;
};

export type PantryItem = {
  id: string;
  name: string;
};
