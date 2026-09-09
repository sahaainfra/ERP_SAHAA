// ============================================================
// BUILDCORE ERP - MAIN APPLICATION
// Part 01: Foundation - Authentication, Shell, Core Services
// ============================================================

import React, { useEffect } from 'react';
import { useAuthStore, useThemeStore } from './store';
import { LoginPage } from './components/auth/LoginPage';
import { AppShell } from './components/layout/AppShell';

function App() {
  const { isAuthenticated } = useAuthStore();
  const { mode, resolvedTheme, setMode } = useThemeStore();

  // Initialize theme on mount
  useEffect(() => {
    const resolved = mode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;
    
    // Apply theme
    if (resolved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (mode === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mode]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AppShell />;
}

export default App;
