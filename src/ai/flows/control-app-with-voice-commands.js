'use server';
/**
 * @fileOverview A voice command processing AI agent.
 *
 * - processVoiceCommand - A function that processes user voice commands to control the culinary copilot app.
 * - VoiceCommandInput - The input type for the processVoiceCommand function.
 * - VoiceCommandOutput - The return type for the processVoiceCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const VoiceCommandInputSchema = z.object({
  command: z.string().describe('The voice command issued by the user.'),
  currentStep: z.number().optional().describe('The current step in the recipe, if applicable.'),
  recipeName: z.string().optional().describe('The name of the current recipe, if applicable.'),
});

const VoiceCommandOutputSchema = z.object({
  action: z.string().describe('The action to be taken by the app (e.g., next_step, previous_step, substitute_ingredient).'),
  data: z.record(z.any()).optional().describe('Additional data required for the action (e.g., ingredient to substitute, new step number).'),
  response: z.string().optional().describe('A textual response to be spoken back to the user.'),
});

export async function processVoiceCommand(input) {
  return processVoiceCommandFlow(input);
}

const processVoiceCommandPrompt = ai.definePrompt({
  name: 'processVoiceCommandPrompt',
  input: {schema: VoiceCommandInputSchema},
  output: {schema: VoiceCommandOutputSchema},
  prompt: `You are a helpful AI assistant that interprets voice commands for a cooking application.

  The application is designed to help users navigate recipes hands-free.

  Based on the user's voice command, you need to determine the appropriate action for the application to take.

  Available actions:
  - next_step: Move to the next step in the recipe.
  - previous_step: Move to the previous step in the recipe.
  - substitute_ingredient: Suggest a substitute for a given ingredient. The ingredient should be provided in the data field.
  - repeat_step: Repeat the current step.
  - get_nutritional_info: Get the nutritional information for the recipe. The recipe name should be provided in the recipeName field.
  - go_to_step: Go to a specific step number in the recipe. The step number should be provided in the data field. step number starts with 1.

  Consider these example voice commands and corresponding actions:
  - User: \"Next step\" -> Action: next_step
  - User: \"What is a substitute for butter?\" -> Action: substitute_ingredient, Data: { ingredient: \"butter\" }
  - User: \"Repeat step\" -> Action: repeat_step
  - User: \"Nutritional info\" -> Action: get_nutritional_info
  - User: \"Go to step 5\" -> Action: go_to_step, Data: {step: 5}

  Current Recipe Name: {{{recipeName}}}
  Current Step: {{{currentStep}}}
  Voice Command: {{{command}}}

  Return a JSON object with the action and any required data.
  Ensure the action and data are valid based on the available actions.
`,
});

const processVoiceCommandFlow = ai.defineFlow(
  {
    name: 'processVoiceCommandFlow',
    inputSchema: VoiceCommandInputSchema,
    outputSchema: VoiceCommandOutputSchema,
  },
  async input => {
    const {output} = await processVoiceCommandPrompt(input);
    return output!;
  }
);
