import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleCompactMode } from '../store/uiSlice';
import { Button } from '../ui/components/Button';

export function HomePage() {
  const compact = useAppSelector((state) => state.ui.compact);
  const dispatch = useAppDispatch();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Typography variant="h3" component="h1" className="font-black text-slate-900">
          Ortho & Neuro Rehab Center
        </Typography>
        <Typography className="max-w-3xl text-slate-600">
          Your project is now migrated to React 18 + TypeScript, Vite 6, React Router 7, Redux Toolkit, Tailwind CSS 4,
          Radix UI primitives, and MUI.
        </Typography>
      </div>

      <Card className="rounded-2xl border border-slate-200 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label="React 18" color="primary" />
            <Chip label="TypeScript" color="primary" />
            <Chip label="Vite 6" color="primary" />
            <Chip label="Router 7" color="primary" />
            <Chip label="Redux Toolkit" color="primary" />
            <Chip label="Tailwind 4" color="secondary" />
            <Chip label="Radix + MUI" color="secondary" />
          </Stack>

          <div className="flex items-center gap-3">
            <Button onClick={() => dispatch(toggleCompactMode())}>Toggle Compact Mode</Button>
            <Chip label={compact ? 'Compact: ON' : 'Compact: OFF'} />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
