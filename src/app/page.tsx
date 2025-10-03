'use client';

import { AppShell } from '@/components/app-shell';
import { GenerateRecipeForm } from '@/components/generate-recipe-form';
import { RecipeView } from '@/components/recipe-view';
import { useAppState } from '@/context/app-provider';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

function WelcomeState() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-full text-center p-8">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            width={400}
            height={267}
            className="rounded-xl object-cover mb-8 shadow-lg"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <h2 className="text-4xl font-bold mb-2">Welcome to Culinary Copilot</h2>
        <p className="text-lg text-muted-foreground max-w-md">
          Let's turn the ingredients you have into a delicious meal. Fill out the form to get started!
        </p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { currentRecipe } = useAppState();

  return (
    <AppShell>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
          <GenerateRecipeForm />
        </div>
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          {currentRecipe ? <RecipeView recipe={currentRecipe} /> : <WelcomeState />}
        </div>
      </main>
    </AppShell>
  );
}
