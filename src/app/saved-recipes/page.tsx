import { AppShell } from '@/components/app-shell';
import { SavedRecipesList } from '@/components/saved-recipes-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SavedRecipesPage() {
  return (
    <AppShell>
      <div className="p-4 sm:px-6 sm:py-0">
        <Card>
          <CardHeader>
            <CardTitle>Saved Recipes</CardTitle>
            <CardDescription>Your collection of favorite recipes. Click one to view it.</CardDescription>
          </CardHeader>
          <CardContent>
            <SavedRecipesList />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
