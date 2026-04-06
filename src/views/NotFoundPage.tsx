import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Button } from '../ui/components/Button';

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <Typography variant="h2" component="h1" className="font-black text-[--theme-blue]">
        404
      </Typography>
      <Typography variant="h5" className="mt-2 font-bold text-slate-900">
        Page not found
      </Typography>
      <Typography className="mt-3 text-slate-600">The page you requested does not exist.</Typography>
      <Button asChild className="mt-6">
        <Link to="/">Back to home</Link>
      </Button>
    </section>
  );
}
