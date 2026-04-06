import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <AppBar position="sticky" color="inherit" elevation={0} className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <Toolbar>
          <Typography variant="h6" className="font-extrabold text-[--theme-blue]">
            Negi Physiotherapy Clinic
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="py-8">
        <Outlet />
      </Container>
    </div>
  );
}
