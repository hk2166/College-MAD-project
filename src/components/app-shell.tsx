'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ChefHat, ShoppingBasket, Heart, Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Link from 'next/link';

function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-2">
      <ChefHat className="size-7 text-primary" />
      <h1 className="text-xl font-bold tracking-tight">Culinary Copilot</h1>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: '/', label: 'Generate Recipe', icon: Home },
    { href: '/pantry', label: 'My Pantry', icon: ShoppingBasket },
    { href: '/saved-recipes', label: 'Saved Recipes', icon: Heart },
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <AppLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  onClick={() => router.push(item.href)}
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
