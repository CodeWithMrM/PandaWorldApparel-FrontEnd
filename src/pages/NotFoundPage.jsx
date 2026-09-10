import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="container-px mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="font-display text-8xl font-extrabold text-ink/10">404</span>
      <h1 className="font-display text-2xl font-bold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-ink/55">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button variant="solid" asChild className="mt-2">
        <Link to="/">Back to Home</Link>
      </Button>
    </div>
  );
}
