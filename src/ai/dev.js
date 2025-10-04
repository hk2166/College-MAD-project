import { config } from 'dotenv';
config();

import '@/ai/flows/generate-recipe-from-ingredients.ts';
import '@/ai/flows/suggest-ingredient-substitutions.ts';
import '@/ai/flows/control-app-with-voice-commands.ts';