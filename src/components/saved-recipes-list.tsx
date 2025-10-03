'use client';

import { useAppState } from '@/context/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import type { Recipe } from '@/lib/types';

export function SavedRecipesList() {
  const { savedRecipes, viewSavedRecipe, unsaveRecipe } = useAppState();
  const router = useRouter();

  const handleViewRecipe = (recipe: Recipe) => {
    viewSavedRecipe(recipe);
    router.push('/');
  };

  if (savedRecipes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">You haven't saved any recipes yet.</p>
        <Button variant="link" onClick={() => router.push('/')}>
          Find a recipe to cook
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {savedRecipes.map((recipe) => (
        <Card key={recipe.id} className="overflow-hidden group relative">
          <button onClick={() => handleViewRecipe(recipe)} className="block w-full text-left">
            <CardHeader className="p-0">
              <Image
                src={recipe.imageUrl}
                alt={recipe.recipeName}
                width={600}
                height={400}
                className="w-full h-40 object-cover"
                data-ai-hint={recipe.imageHint}
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {recipe.recipeName}
              </CardTitle>
            </CardContent>
          </button>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              unsaveRecipe(recipe.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Recipe</span>
          </Button>
        </Card>
      ))}
    </div>
  );
}
