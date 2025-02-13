import { useActor } from '@/actor';
import { useMutation } from '@tanstack/react-query';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { toast } from './use-toast';
import { queryClient } from '@/routes/__root';
import { AgentRules } from 'src/backend/declarations/backend.did';

export default function useSetAgentRules() {
  const { actor: backend } = useActor();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();

  return useMutation({
    mutationFn: async (agentRules: AgentRules) => {
      if (!principal) {
        throw new Error('Principal is required.');
      }

      const result = await backend?.set_agent_rules(agentRules);

      if (result === undefined) {
        throw new Error('Undefined result returned.');
      }

      if ('Err' in result) {
        toast({
          title: `Set allow agent rules failed: ${result.Err}`,
          variant: 'destructive',
        });
        throw new Error(result.Err);
      }

      queryClient.invalidateQueries({
        queryKey: ['get_agent_rules', principal],
      });

      return result.Ok;
    },
  });
}
