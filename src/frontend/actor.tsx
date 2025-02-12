// Actors.tsx

import { ReactNode } from 'react';
import {
  ActorProvider,
  createActorContext,
  createUseActorHook,
  InterceptorErrorData,
} from 'ic-use-actor';
import { canisterId, idlFactory } from '../backend/declarations/index';
import { _SERVICE } from '../backend/declarations/backend.did';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { toast } from './hooks/use-toast';

const actorContext = createActorContext<_SERVICE>();
export const useActor = createUseActorHook<_SERVICE>(actorContext);

export default function Actors({ children }: { children: ReactNode }) {
  const { identity, clear } = useInternetIdentity();

  const errorToast = (error: unknown) => {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      toast({
        title: error.message as string,
        variant: 'destructive',
      });
    }
  };

  const handleResponseError = (data: InterceptorErrorData) => {
    const { error } = data;
    console.error('onResponseError', error);
    if (
      error instanceof Error &&
      (error.message.includes('Invalid delegation') ||
        error.message.includes('Specified sender delegation has expired') ||
        error.message.includes('Invalid basic signature') ||
        error.message.includes('Invalid certificate'))
    ) {
      toast({
        variant: 'destructive',
        description: 'Invalid delegation. Please log in again.',
      });
      setTimeout(() => {
        clear(); // Clears the identity from the state and local storage. Effectively "logs the user out".
        window.location.reload(); // Reload the page to reset the UI.
      }, 1000);
      return;
    }

    if (typeof data === 'object' && 'message' in data) {
      errorToast(data);
    }
  };

  return (
    <ActorProvider<_SERVICE>
      canisterId={canisterId}
      context={actorContext}
      identity={identity}
      idlFactory={idlFactory}
      onResponseError={handleResponseError}
    >
      {children}
    </ActorProvider>
  );
}
