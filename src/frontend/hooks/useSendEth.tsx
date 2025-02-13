import { useActor } from '@/actor';
import { useMutation } from '@tanstack/react-query';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { decimalStringToEth } from '@/lib/eth';
import { queryClient } from '@/routes/__root';
import useHandleAgentError from './useHandleAgentError';

export default function useSendEth() {
  const { actor: backend } = useActor();
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { handleAgentError } = useHandleAgentError();

  return useMutation({
    mutationFn: async ({ to, amount }: { to: string; amount: string }) => {
      if (!principal) {
        throw new Error('Principal is required.');
      }

      try {
        const result = await backend?.send_eth(
          to,
          decimalStringToEth(amount),
          [],
        );
        // Refresh the balance in 5 seconds to give the Etherscan API time to catch up.
        // A better way to update balace would of course be:
        // 1. Parse response and check that transaction was successful
        // 2. Update balance manually, no API calls required.
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['balance'] });
          queryClient.invalidateQueries({ queryKey: ['history'] });
        }, 5000);
        return result;
      } catch (e) {
        handleAgentError(e);
        console.error(e);
      }
    },
  });
}
