import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useActor } from '@/actor';
import { decimalStringToEth } from '@/lib/eth';
import useHandleAgentError from '@/hooks/useHandleAgentError';
import { queryClient } from '@/routes/__root';
import HomeLink from '@/components/home-link';
import { MainMenu } from '@/components/main-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/send')({
  component: SendPage,
});

export default function SendPage() {
  const { actor: backend } = useActor();
  const { handleAgentError } = useHandleAgentError();
  const {
    mutate: sendEth,
    isPending: isSending,
    isError,
    data: sendResult,
  } = useMutation({
    mutationFn: async ({ to, amount }: { to: string; amount: string }) => {
      if (!backend) {
        throw new Error('backend actor not initialized');
      }
      try {
        const result = await backend.send_eth(to, decimalStringToEth(amount));
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendEth({
      to: event.currentTarget.toAddress.value,
      amount: event.currentTarget.amount.value,
    });
  };

  return (
    <main>
      <section className="flex flex-col">
        <div className="flex justify-between">
          <HomeLink />
          <MainMenu />
        </div>
        <div className="flex flex-col gap-5">
          <h3>Send</h3>
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder="To address"
                name="toAddress"
                data-1p-ignore
              />
              <Input
                type="text"
                placeholder="Amount"
                name="amount"
                data-1p-ignore
              />
              <Button disabled={isSending} type="submit">
                {isSending ? (
                  <>
                    <LoaderCircle className="animate-spin w-4 h-4 mr-1" />
                    Sending ...
                  </>
                ) : (
                  'Send'
                )}
              </Button>
              {isError && (
                <div className="font-semibold bg-destructive/30 rounded-lg p-2 text-destructive-foreground">
                  There was an error sending ETH.
                </div>
              )}
              {sendResult && (
                <pre className="bg-muted text-xs rounded-lg p-2 whitespace-pre-wrap break-all break-words box-border overflow-x-auto text-left">
                  {JSON.stringify(sendResult)}
                </pre>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
