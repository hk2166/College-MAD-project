'use client';

import type { Recipe } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppState } from '@/context/app-provider';
import { Heart, ChefHat, BarChart, ArrowLeft, Tags } from 'lucide-react';
import { useState } from 'react';
import { SubstitutionModal } from './substitution-modal';
import { VoiceControl } from './voice-control';

function parseList(text: string): string[] {
  if (!text) return [];
  // Handles numbered lists, bullet points, or just newlines
  return text.split(/\s*(?:\d+\.\s*|\*\s*|-\s*|\n)\s*/).filter((item) => item.trim() !== '');
}

export function RecipeView({ recipe }: { recipe: Recipe }) {
  const { isRecipeSaved, saveRecipe, unsaveRecipe, setCurrentRecipe } = useAppState();
  const [substitutionIngredient, setSubstitutionIngredient] = useState<string | null>(null);

  const isSaved = isRecipeSaved(recipe.id);
  const ingredients = parseList(recipe.ingredients);
  const instructions = parseList(recipe.instructions);
  const nutrition = parseList(recipe.nutritionalInformation || '');

  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, instructions.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    // Step is 1-indexed for users
    if (step >= 1 && step <= instructions.length) {
      setCurrentStep(step - 1);
    }
  };

  const repeatStep = () => {
    // This is more for voice feedback, which we can add later.
    // For now, it doesn't do anything visually.
  };

  const handleOpenSubstitution = (ingredient: string) => {
    // Clean up ingredient from any list markers
    const cleanedIngredient = ingredient.replace(/^\d+\.\s*/, '').trim();
    setSubstitutionIngredient(cleanedIngredient);
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10 bg-background/70 hover:bg-background"
            onClick={() => setCurrentRecipe(null)}
          >
            <ArrowLeft />
            <span className="sr-only">Back to form</span>
          </Button>
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <VoiceControl
              recipeName={recipe.recipeName}
              currentStep={currentStep + 1}
              goToNextStep={goToNextStep}
              goToPreviousStep={goToPreviousStep}
              goToStep={goToStep}
              repeatStep={repeatStep}
              openSubstitutionModal={handleOpenSubstitution}
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={() => (isSaved ? unsaveRecipe(recipe.id) : saveRecipe(recipe))}
              className="bg-background/70 hover:bg-background"
            >
              <Heart className={isSaved ? 'fill-primary text-primary' : 'text-foreground'} />
              <span className="sr-only">{isSaved ? 'Unsave Recipe' : 'Save Recipe'}</span>
            </Button>
          </div>
          <Image
            src={recipe.imageUrl}
            alt={recipe.recipeName}
            width={800}
            height={400}
            className="w-full h-64 object-cover"
            data-ai-hint={recipe.imageHint}
          />
        </CardHeader>
        <CardContent className="p-6">
          <CardTitle className="text-3xl font-bold mb-4">{recipe.recipeName}</CardTitle>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div>
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <Tags className="text-primary" /> Ingredients
                </h3>
                <ul className="space-y-2">
                  {ingredients.map((item, index) => (
                    <li key={index} className="flex justify-between items-center group">
                      <span className="text-muted-foreground">{item}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleOpenSubstitution(item)}
                      >
                        Substitute
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              {nutrition.length > 0 && (
                <div>
                  <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                    <BarChart className="text-primary" /> Nutrition
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {nutrition.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-6">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                <ChefHat className="text-primary" /> Instructions
              </h3>
              <div className="space-y-4 relative">
                {instructions.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      currentStep === index
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-transparent bg-muted/30'
                    }`}
                  >
                    <p className="font-bold text-foreground">Step {index + 1}</p>
                    <p className="text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-6">
                <Button onClick={goToPreviousStep} disabled={currentStep === 0} variant="outline">
                  Previous Step
                </Button>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {instructions.length}
                </span>
                <Button onClick={goToNextStep} disabled={currentStep === instructions.length - 1}>
                  Next Step
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {substitutionIngredient && (
        <SubstitutionModal
          ingredient={substitutionIngredient}
          onOpenChange={(isOpen) => !isOpen && setSubstitutionIngredient(null)}
        />
      )}
    </>
  );
}
