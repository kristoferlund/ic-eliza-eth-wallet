import { createFileRoute } from '@tanstack/react-router';
import { MainMenu } from '@/components/main-menu';
import HomeLink from '@/components/home-link';
import useEthAddress from '@/hooks/useGetAddress';
import useTxHistory from '@/hooks/useTxHistory';
import { Skeleton } from '@/components/ui/skeleton';
import { formatUnits } from 'viem';

export const Route = createFileRoute('/history')({
  component: HistoryPage,
});

interface EthTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
}

export function HistoryList() {
  const { data: address } = useEthAddress();
  const {
    data: history,
    isPending: isFetchingBalance,
    isError,
  } = useTxHistory(address);

  if (isFetchingBalance) {
    return <Skeleton className="w-full h-14" />;
  }

  if (isError) {
    return (
      <div className="font-semibold bg-destructive/30 rounded-lg p-2 text-destructive-foreground">
        Couldn't get wallet history.
      </div>
    );
  }

  if (!history?.length) {
    return <div className="text-muted-foreground">No transactions found.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {history.map((tx: EthTransaction) => {
        const isOutgoing = tx.from.toLowerCase() === address?.toLowerCase();
        const counterparty = isOutgoing ? tx.to : tx.from;
        const formattedAddress = `${counterparty.slice(0, 6)}...${counterparty.slice(-4)}`;
        const formattedAmount = `${formatUnits(BigInt(tx.value), 18)}`;

        return (
          <div
            key={tx.hash}
            className="border p-3 rounded-md flex justify-between items-center bg-muted"
          >
            <span className={isOutgoing ? 'text-red-500' : 'text-green-500'}>
              {isOutgoing ? 'Sent' : 'Received'}
            </span>
            <span className="text-muted-foreground">{formattedAddress}</span>
            <span className="font-medium">{formattedAmount}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function HistoryPage() {
  const { data: address } = useEthAddress();
  return (
    <main>
      <section className="flex flex-col">
        <div className="flex justify-between">
          <HomeLink />
          <MainMenu />
        </div>
        <div className="flex flex-col gap-5">
          <h3>History</h3>
          <HistoryList />
          <div className="text-sm text-foreground/50">
            Full transaction History on{' '}
            <a
              href={`https://sepolia.etherscan.io/address/${address}`}
              className="underline"
              target="_blank"
            >
              Etherscan
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
