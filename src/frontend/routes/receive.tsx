import HomeLink from '@/components/home-link';
import { MainMenu } from '@/components/main-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import useEthAddress from '@/hooks/useGetAddress';
import { createFileRoute } from '@tanstack/react-router';
import { Copy } from 'lucide-react';
import QRCode from 'react-qr-code';

export const Route = createFileRoute('/receive')({
  component: RouteComponent,
});

function copyToClipboard(address: string) {
  navigator.clipboard.writeText(address);
  toast({ title: 'Copied' });
}

function RouteComponent() {
  const { data: address, isPending: isFetchingAddress } = useEthAddress();

  return (
    <main>
      <section className="flex flex-col">
        <div className="flex justify-between">
          <HomeLink />
          <MainMenu />
        </div>
        <div className="flex flex-col gap-5">
          <h3>Receive</h3>
          <div className="font-semibold rounded-lg p-2 bg-muted text-xs">
            Send only SepoliaETH to this address, all other funds will be lost.
          </div>
          {isFetchingAddress && <Skeleton className="w-full h-14" />}
          {address && (
            <>
              {' '}
              <div className="rounded-lg border p-5 bg-primary">
                <QRCode
                  size={256}
                  style={{
                    height: 'auto',
                    maxWidth: '100%',
                    width: '100%',
                    color: 'red',
                  }}
                  value={`ethereum:${address}`}
                  viewBox={`0 0 256 256`}
                  bgColor="#00ffa6"
                />
              </div>
              <code
                className="relative text-center text-2xl rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold hover:bg-muted-foreground cursor-pointer"
                onClick={() => copyToClipboard(address!)}
              >
                {address.slice(0, 5)}...{address.slice(-5)}
                <Copy className="inline-block h-5 w-5 ml-2 pb-[2px]" />
              </code>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
