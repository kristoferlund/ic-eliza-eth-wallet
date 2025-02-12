import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import HomeLink from '@/components/home-link';
import { MainMenu } from '@/components/main-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useSetAllowedAgentRules from '@/hooks/useSetAllowedAgentRules';
import useAllowedAgentRules from '@/hooks/useAllowedAgentRules';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/agent-rules')({
  component: AgentRulesPage,
});

export default function AgentRulesPage() {
  const { data: allowedAgentRules, isPending } = useAllowedAgentRules();
  const {
    mutate: setAllowedAgentRules,
    data: setResult,
    isPending: isSetPending,
    isError: isSetError,
  } = useSetAllowedAgentRules();

  const [transactionsPerDay, setTransactionsPerDay] = useState('0');
  const [maxTransactionAmount, setMaxTransactionAmount] = useState('0');

  useEffect(() => {
    if (isPending) return;
    if (allowedAgentRules) {
      setTransactionsPerDay(allowedAgentRules.transactions_per_day.toString());
      setMaxTransactionAmount(
        allowedAgentRules.max_transaction_amount.toString(),
      );
    }
  }, [allowedAgentRules, isPending]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAllowedAgentRules({
      max_transaction_amount: BigInt(maxTransactionAmount),
      transactions_per_day: Number.parseInt(transactionsPerDay),
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
          <h3>Set agent rules</h3>
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="transactionsPerDay">
                  Max transactions per day
                </Label>
                <Input
                  type="text"
                  id="transactionsPerDay"
                  data-1p-ignore
                  value={transactionsPerDay}
                  onChange={(e) => setTransactionsPerDay(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="transactionsPerDay">
                  Max transaction amount (Wei)
                </Label>
                <Input
                  type="text"
                  name="maxTransactionAmount"
                  data-1p-ignore
                  value={maxTransactionAmount}
                  onChange={(e) => setMaxTransactionAmount(e.target.value)}
                />
              </div>
              <Button disabled={isSetPending} type="submit">
                {isSetPending ? (
                  <>
                    <LoaderCircle className="animate-spin w-4 h-4 mr-1" />
                    Setting rules ...
                  </>
                ) : (
                  'Set rules'
                )}
              </Button>
              {isSetError && (
                <div className="font-semibold bg-destructive/30 rounded-lg p-2 text-destructive-foreground">
                  There was an error setting rules
                </div>
              )}
              {setResult && (
                <pre className="bg-muted text-xs rounded-lg p-2 whitespace-pre-wrap break-all break-words box-border overflow-x-auto text-left">
                  ✅ Rules where set successfully
                </pre>
              )}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
