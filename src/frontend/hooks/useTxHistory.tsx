import { useActor } from '@/actor';
import { useQuery } from '@tanstack/react-query';

export default function useTxHistory(address?: string) {
  const { actor: backend } = useActor();
  return useQuery({
    queryKey: ['history', address],
    queryFn: async () => {
      const response = await fetch(
        `https://api.etherscan.io/v2/api?chainid=11155111&module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY}`,
      );
      const json = await response.json();
      if (json === undefined) {
        throw new Error('Undefined response returned.');
      }
      if ('result' in json) {
        return json.result;
      }
      throw new Error('Invalid response returned.');
    },
    enabled: !!backend && !!address,
  });
}
