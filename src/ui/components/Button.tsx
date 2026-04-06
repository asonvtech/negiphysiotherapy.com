import { Slot } from '@radix-ui/react-slot';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'primary' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
}

const styles: Record<ButtonVariant, string> = {
  primary:
    'bg-[--theme-blue] text-white hover:bg-[--theme-blue-light] border-transparent shadow-md',
  outline:
    'bg-white text-[--theme-blue] border-[--theme-blue]/30 hover:bg-slate-50',
};

export function Button({ asChild, variant = 'primary', className = '', ...props }: PropsWithChildren<ButtonProps>) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--theme-blue-light] ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
