'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { suggestIngredientSubstitutions } from '@/ai/flows/suggest-ingredient-substitutions';
import type { SuggestIngredientSubstitutionsOutput } from '@/ai/flows/suggest-ingredient-substitutions';
import { useAppState } from '@/context/app-provider';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';

interface SubstitutionModalProps {
  ingredient: string;
  onOpenChange: (isOpen: boolean) => void;
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Separator className="my-4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function SubstitutionModal({ ingredient, onOpenChange }: SubstitutionModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [result, setResult] = useState<SuggestIngredientSubstitutionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { pantryItems } = useAppState();
  const { toast } = useToast();

  useEffect(() => {
    const getSubstitutions = async () => {
      setIsLoading(true);
      try {
        const availableIngredients = pantryItems.map((item) => item.name).join(', ');
        const res = await suggestIngredientSubstitutions({
          ingredient,
          availableIngredients,
          dietaryRestrictions: '', // This could be a user preference from context later
        });
        setResult(res);
      } catch (error) {
        console.error('Failed to get substitutions:', error);
        toast({
          title: 'Error',
          description: 'Could not find substitutions. Please try again.',
          variant: 'destructive',
        });
        // Close modal on error
        setIsOpen(false);
        onOpenChange(false);
      } finally {
        setIsLoading(false);
      }
    };
    getSubstitutions();
  }, [ingredient, pantryItems, toast, onOpenChange]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Substitutions for <span className="text-primary">{ingredient}</span>
          </DialogTitle>
          <DialogDescription>Here are some alternatives you can use in your recipe.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <LoadingState />
          ) : result ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Suggestions</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {result.substitutions.map((sub, i) => (
                    <li key={i}>{sub}</li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Reasoning</h4>
                <p className="text-sm text-muted-foreground">{result.reasoning}</p>
              </div>
            </div>
          ) : (
            <p>No substitutions found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
