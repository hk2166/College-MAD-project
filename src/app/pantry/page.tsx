import { AppShell } from '@/components/app-shell';
import { PantryManager } from '@/components/pantry-manager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PantryPage() {
  return (
    <AppShell>
      <div className="p-4 sm:px-6 sm:py-0">
        <Card>
          <CardHeader>
            <CardTitle>My Pantry</CardTitle>
            <CardDescription>
              Manage the ingredients you have at home to get better recipe suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PantryManager />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
