import { createFileRoute } from '@tanstack/react-router';
import { LoaderCircle } from 'lucide-react';
import HomeLink from '@/components/home-link';
import { MainMenu } from '@/components/main-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useSetAgentRules from '@/hooks/useSetAgentRules';
import useGetAgentRules from '@/hooks/useGetAgentRules';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/agent-rules')({
  component: AgentRulesPage,
});

export default function AgentRulesPage() {
  const { data: agentRules, isPending } = useGetAgentRules();
  const {
    mutate: setAgentRules,
    data: setResult,
    isPending: isSetPending,
    isError: isSetError,
  } = useSetAgentRules();

  const [waitTimeMinutes, setWaitTimeMinutes] = useState('0');
  const [maxTransactionAmount, setMaxTransactionAmount] = useState('0');

  useEffect(() => {
    if (isPending) return;
    if (agentRules) {
      setWaitTimeMinutes(agentRules.wait_time_minutes.toString());
      setMaxTransactionAmount(agentRules.max_transaction_amount.toString());
    }
  }, [agentRules, isPending]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAgentRules({
      max_transaction_amount: BigInt(maxTransactionAmount),
      wait_time_minutes: BigInt(waitTimeMinutes),
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
                <Label htmlFor="waitTimeMinutes">
                  Wait time between transactions (minutes)
                </Label>
                <Input
                  type="text"
                  id="waitTimeMinutes"
                  data-1p-ignore
                  value={waitTimeMinutes}
                  onChange={(e) => setWaitTimeMinutes(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="waitTimeMinutes">
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
