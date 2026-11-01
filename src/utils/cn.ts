import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'TRY'): string {
  if (currency === 'TRY') {
    return `₺${amount.toLocaleString('tr-TR')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}
