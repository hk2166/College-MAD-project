'use server';

/**
 * @fileOverview An ingredient substitution AI agent.
 *
 * - suggestIngredientSubstitutions - A function that handles the ingredient substitution process.
 * - SuggestIngredientSubstitutionsInput - The input type for the suggestIngredientSubstitutions function.
 * - SuggestIngredientSubstitutionsOutput - The return type for the suggestIngredientSubstitutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestIngredientSubstitutionsInputSchema = z.object({
  ingredient: z
    .string()
    .describe('The ingredient to find a substitution for.'),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe('Any dietary restrictions the substitution should adhere to.'),
  availableIngredients: z
    .string()
    .optional()
    .describe('The ingredients the user has available.'),
});

const SuggestIngredientSubstitutionsOutputSchema = z.object({
  substitutions: z
    .array(z.string())
    .describe('An array of suggested substitutions.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested substitutions.'),
});

export async function suggestIngredientSubstitutions(
  input) {
  return suggestIngredientSubstitutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIngredientSubstitutionsPrompt',
  input: {schema: SuggestIngredientSubstitutionsInputSchema},
  output: {schema: SuggestIngredientSubstitutionsOutputSchema},
  prompt: `You are an expert culinary assistant. A user is looking for a substitute for an ingredient in a recipe.

Ingredient: {{{ingredient}}}
Dietary Restrictions: {{{dietaryRestrictions}}}
Available Ingredients: {{{availableIngredients}}}

Suggest at least three possible substitutions, and explain your reasoning.

Substitutions:`, // enforcing handlebars
});

const suggestIngredientSubstitutionsFlow = ai.defineFlow(
  {
    name: 'suggestIngredientSubstitutionsFlow',
    inputSchema: SuggestIngredientSubstitutionsInputSchema,
    outputSchema: SuggestIngredientSubstitutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
