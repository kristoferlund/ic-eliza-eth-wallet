import { Send } from 'lucide-react';
import { Button } from './ui/button';
import useEthAddress from '@/hooks/useGetAddress';
import { Link } from '@tanstack/react-router';

export default function SendButton() {
  const { isPending: isFetchingAddress } = useEthAddress();

  return (
    <Link to="/send" disabled={isFetchingAddress} className="w-full">
      <Button
        disabled={isFetchingAddress}
        className="flex flex-col h-30 w-full items-start gap-1"
      >
        <Send className="w-5 h-5" />
        Send
      </Button>
    </Link>
  );
}
