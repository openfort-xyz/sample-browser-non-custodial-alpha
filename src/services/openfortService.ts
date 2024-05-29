import { AuthPlayerResponse, AuthType, OAuthProvider, ShieldAuthentication, TokenType, TypedDataDomain, TypedDataField } from '@openfort/openfort-js';
import openfort from '../utils/openfortConfig';

const chainId = 13337;

class OpenfortService {
    async authenticateWithThirdPartyProvider(identityToken: string): Promise<AuthPlayerResponse> {
      try {
        return await openfort.authenticateWithThirdPartyProvider(OAuthProvider.FIREBASE, identityToken, TokenType.ID_TOKEN);
      } catch (error) {
        console.error('Error authenticating with Openfort:', error);
        throw error;
      }
    }
    async mintNFT(identityToken: string): Promise<string | null> {
      try {
        const collectResponse = await fetch(`/api/protected-collect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${identityToken}`,
          },
        });
  
        if (!collectResponse.ok) {
          alert("Failed to mint NFT status: " + collectResponse.status);
          return null
        }
        const collectResponseJSON = await collectResponse.json();
  
        if (collectResponseJSON.data?.nextAction) {
          const response = await openfort.sendSignatureTransactionIntentRequest(
            collectResponseJSON.data.id,
            collectResponseJSON.data.nextAction.payload.userOperationHash
          );
          return response.response?.transactionHash ?? null
        }else return null
      } catch (error) {
        console.error("Error:", error);
        return null
      }
    }
    async signMessage(message: string): Promise<string | null> {
      try {
        return await openfort.signMessage(message);
      } catch (error) {
        console.error("Error:", error);
        return null
      }
    }
    async signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<string | null> {
      try {
        return await openfort.signTypedData(domain, types, value);
      } catch (error) {
        console.error("Error:", error);
        return null
      }
    }
    async getEmbeddedState() {
      try {
        const state = await openfort.getEmbeddedState();
        return state;
      } catch (error) {
        console.error('Error retrieving embedded state from Openfort:', error);
        throw error;
      }
    }
     
    async setAutomaticRecoveryMethod(identityToken: string) {
      try {
        const shieldAuth: ShieldAuthentication = {
          auth: AuthType.OPENFORT,
          token: identityToken,
          authProvider: "firebase",
          tokenType: "idToken",
        };
        await openfort.configureEmbeddedSigner(chainId, shieldAuth);
      } catch (error) {
        console.error('Error authenticating with Openfort:', error);
        throw error;
      }
    }

    async setPasswordRecoveryMethod(identityToken: string, pin: string) {
      try {
        const shieldAuth: ShieldAuthentication = {
          auth: AuthType.OPENFORT,
          token: identityToken,
          authProvider: "firebase",
          tokenType: "idToken",
        };
        await openfort.configureEmbeddedSigner(chainId, shieldAuth, pin);
      } catch (error) {
        console.error('Error authenticating with Openfort:', error);
        throw error;
      }
    }
    async logout() {
      try {
        await openfort.logout();
      } catch (error) {
        console.error('Error logging out with Openfort:', error);
        throw error;
      }
    }
  }

  
  
  // Create a singleton instance of the OpenfortService
  const openfortService = new OpenfortService();
  
  export default openfortService;
  