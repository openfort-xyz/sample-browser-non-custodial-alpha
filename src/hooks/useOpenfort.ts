import { useState, useCallback, useEffect, useRef } from 'react';
import openfortService from '../services/openfortService'; // Adjust the import path as needed
import { EmbeddedState } from '@openfort/openfort-js';

export const useOpenfort = () => {
  const [error, setError] = useState<Error | null>(null);
  const [embeddedState, setEmbeddedState] = useState<EmbeddedState>(EmbeddedState.NONE);
  const [isPolling, setIsPolling] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    // Mark the component as mounted
    isMounted.current = true;

    const pollEmbeddedState = async () => {
      if (!isPolling) return;

      const interval = setInterval(async () => {
        try {
          const state = await openfortService.getEmbeddedState();
          if (isMounted.current) {
            setEmbeddedState(state);
            if (state === EmbeddedState.READY) {
              setIsPolling(false); // Stop polling
            }
          }
        } catch (error) {
          console.error('Error checking embedded state with Openfort:', error);
          setIsPolling(false); // Optionally stop polling on error
        }
      }, 300);

      return () => clearInterval(interval);
    }

    pollEmbeddedState();
    return () => {
      isMounted.current = false;
      setIsPolling(false); // Ensure polling is stopped
    };
  }, [isPolling]);

  // Assume openfortService has been updated to handle these states and actions
  const authenticateWithOpenfort = useCallback(async (identityToken: string) => {
    try {
      await openfortService.authenticateWithThirdPartyProvider(identityToken);
    } catch (error) {
      console.error('Error authenticating with Openfort:', error);
      setError(error instanceof Error ? error : new Error('An error occurred during Openfort authentication'));
    }
  }, []);

  const mintNFT = useCallback(async (identityToken: string): Promise<string | null> => {
    try {
      return await openfortService.mintNFT(identityToken);
    } catch (error) {
      console.error('Error minting NFT with Openfort:', error);
      setError(error instanceof Error ? error : new Error('An error occurred minting the NFT'));
      return null;
    }
  }, []);

  const handleRecovery = useCallback(async (method: "password"|"automatic", identityToken: string, pin?: string) => {
    try {
      if(method==="automatic"){
        await openfortService.setAutomaticRecoveryMethod(identityToken)
      } else if(method==="password"){
        if (!pin || pin.length < 4) {
          alert("Password recovery must be at least 4 characters");
          return;
        }
        await openfortService.setPasswordRecoveryMethod(identityToken, pin);
      }
    } catch (error) {
      console.error('Error handling recovery with Openfort:', error);
      setError(error instanceof Error ? error : new Error('An error occurred during recovery handling'));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await openfortService.logout();
    } catch (error) {
      console.error('Error logging out with Openfort:', error);
      setError(error instanceof Error ? error : new Error('An error occurred during logout'));
    }
  }, []);

  return {
    authenticateWithOpenfort,
    embeddedState,
    mintNFT,
    handleRecovery,
    error,
    logout  
  }
};
