'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAppState } from '@/context/app-provider';
import { generateRecipeFromIngredients } from '@/ai/flows/generate-recipe-from-ingredients';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  ingredients: z.string().min(3, 'Please list at least one ingredient.'),
  dietaryRestrictions: z.string().optional(),
  cuisinePreferences: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function GenerateRecipeForm() {
  const { pantryItems, setCurrentRecipe } = useAppState();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const defaultIngredients = pantryItems.map((item) => item.name).join(', ');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: defaultIngredients,
      dietaryRestrictions: '',
      cuisinePreferences: '',
    },
  });

  // Effect to update form values when pantryItems changes
  useEffect(() => {
    const newDefaultIngredients = pantryItems.map((item) => item.name).join(', ');
    form.reset({
      ingredients: newDefaultIngredients,
      dietaryRestrictions: form.getValues().dietaryRestrictions || '',
      cuisinePreferences: form.getValues().cuisinePreferences || '',
    });
  }, [pantryItems, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setCurrentRecipe(null);
    try {
      const result = await generateRecipeFromIngredients(values);

      // Select a random recipe placeholder image
      const recipeImages = PlaceHolderImages.filter((img) => img.id.startsWith('recipe-'));
      const randomImage = recipeImages[Math.floor(Math.random() * recipeImages.length)];

      setCurrentRecipe({
        ...result,
        id: crypto.randomUUID(),
        imageUrl: randomImage.imageUrl,
        imageHint: randomImage.imageHint,
      });
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      toast({
        title: 'Error Generating Recipe',
        description: 'There was an issue creating your recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate a Recipe</CardTitle>
        <CardDescription>Tell us what you have, and we'll create a dish for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Ingredients</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., chicken breast, tomatoes, rice" {...field} rows={5} />
                  </FormControl>
                  <FormDescription>
                    List ingredients you have, separated by commas. Your pantry items are added automatically.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., vegetarian, gluten-free" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cuisinePreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine Preferences (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Italian, Mexican" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Generating...' : 'Generate Recipe'}
              {!isLoading && <Sparkles className="ml-2" />}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
