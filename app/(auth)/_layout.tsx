import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AuthLayout() {
  useEffect(() => {
    // 🚀 Automatically Skip Login & Go to Main App
    router.replace('/(tabs)');
  }, []);

  return null; // Prevents login screen from rendering at all
}


