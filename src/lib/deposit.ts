import axios from 'axios';
import { useWalletStore } from './store';

// Use local API route to avoid CORS issues
const MEMPOOL_API = '/api/mempool';
const STACKS_API = 'https://api.testnet.hiro.so';
const EMILY_API = 'https://emily-testnet.api.stacks.so';

/**
 * Generate a deposit address for sBTC peg-in
 * For MVP, we'll use a simple approach: derive from Stacks address
 * In production, this would use sbtc-lib
 */
export async function generateDepositAddress(stacksAddress: string): Promise<{
  address: string;
  scriptPubKey: string;
}> {
  // For MVP, return a placeholder
  // In production, use sbtc-lib to generate proper deposit address
  console.log('Generating deposit address for:', stacksAddress);

  // Placeholder: In real implementation, call sbtc-lib
  return {
    address: 'tb1q059mkww649k4fuuwr5648ew22ac209z3sn85a0', // Using user's confirmed address for testing
    scriptPubKey: '0014751e76e8199196d454941c45d1b3a1912f5ebb47',
  };
}

/**
 * Poll Bitcoin network for transaction confirmations
 * Tries multiple networks to find the transaction
 */
export async function pollBtcConfirmations(txid: string): Promise<number> {
  const networks = ['testnet4', 'testnet', 'signet'];
  
  for (const network of networks) {
    try {
      const response = await axios.get(`${MEMPOOL_API}/tx/${txid}`, {
        headers: {
          'x-bitcoin-network': network,
        },
      });
      
      console.log(`TX found on ${network}:`, response.data.status);

      if (response.data.status?.confirmed) {
        return response.data.status.block_height || 6;
      }

      // Count confirmations from mempool
      return response.data.status?.block_height ? 6 : 0;
    } catch (error) {
      // Try next network
      console.log(`TX not found on ${network}, trying next...`);
      continue;
    }
  }
  
  console.error('Transaction not found on any network:', txid);
  return 0;
}

/**
 * Initiate sBTC peg-in via Emily API
 */
export async function initiatePegIn(
  txid: string,
  vout: number,
  stacksAddress: string
): Promise<{ status: string; depositId?: string }> {
  try {
    console.log('Initiating peg-in:', { txid, vout, stacksAddress });

    const response = await axios.post(`${EMILY_API}/deposit`, {
      txid,
      vout,
      stacksAddress,
    });

    console.log('Peg-in response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error initiating peg-in:', error);
    if (axios.isAxiosError(error)) {
      console.error('Emily API error:', error.response?.data);
    }
    return { status: 'error' };
  }
}

/**
 * Check sBTC balance on Stacks
 */
export async function checkSbtcBalance(stacksAddress: string): Promise<number> {
  try {
    const response = await axios.get(
      `${STACKS_API}/extended/v1/address/${stacksAddress}/balances`
    );

    const sbtcBalance = response.data.sbtc?.balance || 0;
    const btc = parseInt(sbtcBalance) / 100000000;

    console.log('sBTC balance:', btc);
    return btc;
  } catch (error) {
    console.error('Error checking sBTC balance:', error);
    return 0;
  }
}

/**
 * Initiate sBTC peg-out (Withdrawal)
 */
export async function withdrawSbtc(
  amount: number,
  btcAddress: string,
  stacksAddress: string
): Promise<{ status: string; txid?: string }> {
  try {
    console.log('Initiating peg-out (withdrawal):', { amount, btcAddress, stacksAddress });
    
    // In a real implementation, this would involve signing a Stacks transaction 
    // that calls the sBTC contract's 'withdraw' function.
    // For this MVP, we simulate the request to the Emily API or similar.
    
    const response = await axios.post(`${EMILY_API}/withdraw`, {
      amount: Math.floor(amount * 100000000), // Convert to satoshis
      btcAddress,
      stacksAddress,
    });

    console.log('Withdrawal initiated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error initiating withdrawal:', error);
    return { status: 'error' };
  }
}

/**
 * Monitor deposit progress
 */
export async function monitorDeposit(
  txid: string,
  stacksAddress: string,
  onProgress: (status: string, confirmations: number) => void
): Promise<boolean> {
  try {
    // Poll for confirmations
    for (let i = 0; i < 60; i++) {
      const confirmations = await pollBtcConfirmations(txid);
      console.log(`Confirmations: ${confirmations}`);

      onProgress('confirming', confirmations);

      if (confirmations >= 1) {
        // Initiate peg-in
        onProgress('minting', confirmations);
        await initiatePegIn(txid, 0, stacksAddress);

        // Wait for sBTC to appear
        for (let j = 0; j < 30; j++) {
          const balance = await checkSbtcBalance(stacksAddress);
          if (balance > 0) {
            onProgress('complete', 6);
            useWalletStore.getState().updateTransactionStatus(txid, 'confirmed');
            return true;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        return true;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }

    return false;
  } catch (error) {
    console.error('Error monitoring deposit:', error);
    return false;
  }
}
