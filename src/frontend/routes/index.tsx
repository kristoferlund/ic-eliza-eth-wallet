import Login from '../components/login';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { Toaster } from '../components/ui/toaster';
import { createFileRoute } from '@tanstack/react-router';
import { EthAddress } from '@/components/eth-address';
import { IcpAddress } from '@/components/icp-address';
import { Balance } from '@/components/balance';
import ReceiveButton from '@/components/receive-button';
import SendButton from '@/components/send-button';
import { Agent } from '@/components/agent';
import { MainMenu } from '@/components/main-menu';

export const Route = createFileRoute('/')({
  component: App,
});

function AppInner() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return <Login />;
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h3>Wallet</h3>
        <MainMenu />
      </div>
      <div className="flex items-center gap-2">
        ETH:
        <EthAddress />
      </div>
      <div className="flex items-center gap-2">
        ICP:
        <IcpAddress />
      </div>
      <div className="flex items-center gap-2">
        <div className="whitespace-nowrap">Allowed Agent:</div>
        <Agent />
      </div>
      <Balance />
      <div className="flex gap-5">
        <ReceiveButton />
        <SendButton />
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main>
      <AppInner />
      <Toaster />

      <div className="links">
        <a
          href="https://github.com/ic-alloy/ic-alloy-basic-wallet/graphs/contributors"
          target="_blank"
          rel="noreferrer"
        >
          <img src="https://img.shields.io/github/contributors/ic-alloy/ic-alloy-basic-wallet.svg?style=for-the-badge" />
        </a>
        <a
          href="https://github.com/ic-alloy/ic-alloy-basic-wallet"
          target="_blank"
          rel="noreferrer"
        >
          <img src="https://img.shields.io/github/license/ic-alloy/ic-alloy-basic-wallet.svg?style=for-the-badge" />
        </a>
        <a
          href="https://github.com/ic-alloy/ic-alloy-basic-wallet/stargazers"
          target="_blank"
          rel="noreferrer"
        >
          <img src="https://img.shields.io/github/stars/ic-alloy/ic-alloy-basic-wallet?style=for-the-badge" />
        </a>
      </div>
    </main>
  );
}
