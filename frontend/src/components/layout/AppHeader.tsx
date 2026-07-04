import { Link, NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { CategoriesNavMenu } from '@/components/categories/CategoriesNavMenu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
              <span className="h-3 w-3 rotate-45 border border-background bg-foreground" />
            </span>
            <span className="text-lg font-semibold tracking-tight">
              Mini Loja
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'font-medium transition-colors hover:text-foreground',
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                )
              }
            >
              Produtos
            </NavLink>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <CategoriesNavMenu />
          <Button asChild size="sm">
            <Link to="/products/new">
              <Plus className="h-4 w-4" />
              Novo produto
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
