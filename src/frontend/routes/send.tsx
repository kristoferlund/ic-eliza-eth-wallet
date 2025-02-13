import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import HomeLink from '@/components/home-link';
import { MainMenu } from '@/components/main-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useSendEth from '@/hooks/useSendEth';

export const Route = createFileRoute('/send')({
  component: SendPage,
});

export default function SendPage() {
  const {
    mutate: sendEth,
    isPending: isSending,
    isError,
    data: sendResult,
  } = useSendEth();

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
