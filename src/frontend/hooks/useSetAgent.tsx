import { useActor } from '@/actor';
import { useMutation } from '@tanstack/react-query';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { toast } from './use-toast';
import { queryClient } from '@/routes/__root';

export default function useSetAgent() {
  const { actor: backend } = useActor();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();

  return useMutation({
    mutationFn: async (agent: string) => {
      if (!principal) {
        throw new Error('Principal is required.');
      }

      const result = await backend?.set_agent(agent);

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
        queryKey: ['get_agent', principal],
      });

      return result.Ok;
    },
  });
}
