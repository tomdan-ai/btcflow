import { TurnkeyClient } from "@turnkey/http";
import { WebauthnStamper } from "@turnkey/webauthn-stamper";

const TURNKEY_BASE_URL = "https://api.turnkey.com";

// In a real app, these would be environment variables
const ORGANIZATION_ID = process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID || "mock-org-id";

export class TurnKeyService {
  private client: TurnkeyClient | null = null;
  private stamper: WebauthnStamper | null = null;

  async init(rpId: string = window.location.hostname) {
    this.stamper = new WebauthnStamper({
      rpId,
    });

    this.client = new TurnkeyClient(
      { baseUrl: TURNKEY_BASE_URL },
      this.stamper
    );
  }

  async createPasskey(username: string) {
    if (!this.client || !this.stamper) await this.init();

    // In a real implementation, you'd call TurnKey to create a sub-organization
    // For this MVP, we simulate the sub-org and credential creation
    console.log(`Creating passkey for ${username}...`);
    
    try {
      // This triggers the browser's WebAuthn prompt
      const result = await this.stamper?.stamp("create_passkey");
      console.log("Passkey created successfully", result);
      
      return {
        address: "tb1q_turnkey_derived_address_placeholder",
        organizationId: ORGANIZATION_ID,
      };
    } catch (error) {
      console.error("Error creating passkey:", error);
      throw error;
    }
  }

  async login() {
    if (!this.client || !this.stamper) await this.init();

    console.log("Logging in with passkey...");
    
    try {
      // This triggers the browser's WebAuthn prompt for an existing credential
      const result = await this.stamper?.stamp("login");
      console.log("Login successful", result);
      
      return {
        address: "tb1q_turnkey_derived_address_placeholder",
        organizationId: ORGANIZATION_ID,
      };
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async signTransaction(content: string) {
    if (!this.client) await this.init();
    
    console.log("Signing with TurnKey TEE...", content);
    // Simulating a TEE signature
    return "0x_turnkey_tee_signature_placeholder";
  }
}

export const turnkeyService = new TurnKeyService();
