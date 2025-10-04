'use server';
/**
 * @fileOverview Generates a recipe based on user-provided ingredients, dietary restrictions, and cuisine preferences.
 *
 * - generateRecipeFromIngredients - A function that generates a recipe based on available ingredients.
 * - GenerateRecipeFromIngredientsInput - The input type for the generateRecipeFromIngredients function.
 * - GenerateRecipeFromIngredientsOutput - The return type for the generateRecipeFromIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateRecipeFromIngredientsInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients available to the user.'),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe('Any dietary restrictions the user has (e.g., vegetarian, gluten-free).'),
  cuisinePreferences: z
    .string()
    .optional()
    .describe('The user’s preferred cuisine (e.g., Italian, Mexican).'),
});
export type GenerateRecipeFromIngredientsInput = z.infer<
  typeof GenerateRecipeFromIngredientsInputSchema
>;

const GenerateRecipeFromIngredientsOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z.string().describe('A list of ingredients required for the recipe.'),
  instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
  nutritionalInformation: z
    .string()
    .optional()
    .describe('Nutritional information for the recipe (calories, fat, protein, carbs).'),
});
export type GenerateRecipeFromIngredientsOutput = z.infer<
  typeof GenerateRecipeFromIngredientsOutputSchema
>;

export async function generateRecipeFromIngredients(
  input: GenerateRecipeFromIngredientsInput
): Promise<GenerateRecipeFromIngredientsOutput> {
  return generateRecipeFromIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeFromIngredientsPrompt',
  input: {schema: GenerateRecipeFromIngredientsInputSchema},
  output: {schema: GenerateRecipeFromIngredientsOutputSchema},
  prompt: `You are a helpful cooking assistant. Generate a recipe based on the ingredients the user has on hand, taking into account any dietary restrictions and cuisine preferences.

Ingredients: {{{ingredients}}}
Dietary Restrictions: {{{dietaryRestrictions}}}
Cuisine Preferences: {{{cuisinePreferences}}}

Recipe Name:
Ingredients:
Instructions:
Nutritional Information:`, // Ensure each part is labeled in the output
});

const generateRecipeFromIngredientsFlow = ai.defineFlow(
  {
    name: 'generateRecipeFromIngredientsFlow',
    inputSchema: GenerateRecipeFromIngredientsInputSchema,
    outputSchema: GenerateRecipeFromIngredientsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
