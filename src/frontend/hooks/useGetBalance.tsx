import { useActor } from '@/actor';
import { useQuery } from '@tanstack/react-query';

export default function useGetBalance(address?: string) {
  const { actor: backend } = useActor();
  return useQuery({
    queryKey: ['balance', address],
    queryFn: async () => {
      const response = await fetch(
        `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY}`,
      );
      const json = await response.json();
      if (json === undefined) {
        throw new Error('Undefined balance returned.');
      }
      if ('result' in json) {
        return json.result;
      }
      return '0';
    },
    enabled: !!backend && !!address,
  });
}
