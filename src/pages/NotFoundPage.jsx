import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage({ error = false, message = null }) {
  const isError = error || message;
  
  return (
    <div className="container-px mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="font-display text-8xl font-extrabold text-ink/10">
        {isError ? '⚠️' : '404'}
      </span>
      <h1 className="font-display text-2xl font-bold text-ink">
        {isError ? 'Oops! Something went wrong' : 'Page not found'}
      </h1>
      <p className="max-w-sm text-sm text-ink/55">
        {message || "The page you're looking for doesn't exist or may have moved."}
      </p>
      <div className="mt-4 flex gap-3">
        <Button variant="solid" asChild>
          <Link to="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/support">Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
