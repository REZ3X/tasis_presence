'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from '@/components/HomePage';

export default function Page() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}

