import { useActor } from '@/actor';
import { useQuery } from '@tanstack/react-query';
import useHandleAgentError from './useHandleAgentError';
import { useInternetIdentity } from 'ic-use-internet-identity';

export default function useAllowedAgent() {
  const { actor: backend } = useActor();
  const { handleAgentError } = useHandleAgentError();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();

  return useQuery({
    queryKey: ['get_allowed_agent', principal],
    queryFn: async () => {
      if (!principal) {
        throw new Error('Principal is required.');
      }

      try {
        const result = await backend?.get_allowed_agent();

        if (result === undefined) {
          throw new Error('Undefined result returned.');
        }

        if ('Err' in result) {
          throw new Error(result.Err);
        }

        return result.Ok;
      } catch (e) {
        handleAgentError(e);
        console.error(e);
        throw new Error('Invalid address returned.');
      }
    },
    enabled: !!backend && !!principal,
  });
}
