'use client';

import { AppShell } from '@/components/app-shell';
import { GenerateRecipeForm } from '@/components/generate-recipe-form';
import { RecipeView } from '@/components/recipe-view';
import { useAppState } from '@/context/app-provider';
import { WelcomeScreen } from '@/components/welcome-screen';

export default function HomePage() {
  const { currentRecipe } = useAppState();

  return (
    <AppShell>
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {currentRecipe ? (
          <RecipeView recipe={currentRecipe} />
        ) : (
          <div className="mx-auto grid w-full max-w-2xl gap-4">
            <WelcomeScreen />
            <GenerateRecipeForm />
          </div>
        )}
      </div>
    </AppShell>
  );
}
