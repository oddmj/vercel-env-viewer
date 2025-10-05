import ky from 'ky';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { Response } from '../../server/handler';

export default function useEnvsQuery() {
  return useSuspenseQuery<Response>({
    queryKey: ['envs'],
    queryFn: () => ky.get('/api/envs').json(),
  });
}
