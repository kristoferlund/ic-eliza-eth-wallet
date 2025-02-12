import { CircleArrowDown } from 'lucide-react';
import { Button } from './ui/button';
import useEthAddress from '@/hooks/useEthAddress';
import { Link } from '@tanstack/react-router';

export default function ReceiveButton() {
  const { isPending: isFetchingAddress } = useEthAddress();

  return (
    <Link to="/receive" disabled={isFetchingAddress} className="w-full">
      <Button
        disabled={isFetchingAddress}
        className="flex flex-col h-30 w-full items-start gap-1"
      >
        <CircleArrowDown className="w-5 h-5" />
        Receive
      </Button>
    </Link>
  );
}
