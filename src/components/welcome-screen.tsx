'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function WelcomeScreen() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            width={800}
            height={200}
            className="w-full h-48 object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-2xl font-bold">Welcome to Culinary Copilot</CardTitle>
        <CardDescription className="mt-2 text-muted-foreground">
          Your AI-powered kitchen assistant. Get started by telling us what ingredients you have,
          and we'll whip up a recipe for you. You can also manage your pantry and save your
          favorite creations.
        </CardDescription>
      </CardContent>
    </Card>
  );
}
