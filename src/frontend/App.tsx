import Login from './components/login'
import { useInternetIdentity } from 'ic-use-internet-identity';
import Wallet from './components/wallet';
import { Toaster } from './components/ui/toaster';

function AppInner() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return <Login />
  }

  return (
    <Wallet />
  )
}

export default function App() {
  return <main>
    <AppInner />
    <Toaster />

    <div className="links">
      <a
        href="https://github.com/ic-alloy/ic-alloy-basic-wallet"
        target="_blank" rel="noreferrer"
      >
        <img src="https://img.shields.io/github/license/ic-alloy-basic-wallet/ic-alloy-basic-wallet" />
      </a>

      <a
        href="https://github.com/ic-alloy/ic-alloy-basic-wallet"
        target="_blank" rel="noreferrer"
      >
        <img src="https://img.shields.io/github/stars/ic-alloy/ic-alloy-basic-wallet" />
      </a>
    </div>
  </main>
}

