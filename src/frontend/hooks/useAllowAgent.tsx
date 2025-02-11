import { useActor } from '@/actor';
import { useMutation } from '@tanstack/react-query';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { queryClient } from '@/main';
import { toast } from './use-toast';

export default function useAllowAgent() {
  const { actor: backend } = useActor();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();

  return useMutation({
    mutationFn: async (allowedAgent: string) => {
      if (!principal) {
        throw new Error('Principal is required.');
      }

      const result = await backend?.allow_agent(allowedAgent);

      if (result === undefined) {
        throw new Error('Undefined result returned.');
      }

      if ('Err' in result) {
        toast({
          title: `Allow agent failed: ${result.Err}`,
          variant: 'destructive',
        });
        throw new Error(result.Err);
      }

      queryClient.invalidateQueries({
        queryKey: ['get_allowed_agent', principal],
      });

      return result.Ok;
    },
  });
}
