import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Home';
import { Suspense } from 'react';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <Home />
      </Suspense>
    </QueryClientProvider>
  );
}
