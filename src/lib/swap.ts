import axios from 'axios';

const STACKS_API = 'https://api.testnet.hiro.so';

/**
 * Get swap quote from ALEX
 * For MVP, we'll use a simple calculation
 * In production, use ALEX SDK for accurate quotes
 */
export async function getSwapQuote(
  amountIn: number,
  fromToken: 'sBTC' | 'STX',
  toToken: 'sBTC' | 'STX'
): Promise<{
  amountOut: number;
  fee: number;
  slippage: number;
}> {
  try {
    console.log(`Getting swap quote: ${amountIn} ${fromToken} → ${toToken}`);

    // For MVP: Simple 1:1 ratio with 0.3% fee
    // In production, use ALEX SDK or on-chain price oracle
    const fee = amountIn * 0.003; // 0.3% fee
    const amountOut = amountIn - fee;

    return {
      amountOut,
      fee,
      slippage: 0.01, // 1% slippage
    };
  } catch (error) {
    console.error('Error getting swap quote:', error);
    throw error;
  }
}

/**
 * Build swap transaction
 */
export async function buildSwapTransaction(
  amountIn: number,
  fromToken: 'sBTC' | 'STX',
  toToken: 'sBTC' | 'STX',
  stacksAddress: string
): Promise<{
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
}> {
  try {
    console.log('Building swap transaction...');

    // ALEX contract on testnet
    const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTCE326';
    const contractName = 'alex-swap-v1';

    // For MVP: Simple swap function call
    // In production, use proper ALEX contract interface
    return {
      contractAddress,
      contractName,
      functionName: 'swap-exact-tokens-for-tokens',
      functionArgs: [
        { type: 'uint128', value: Math.floor(amountIn * 100000000) }, // Amount in satoshis
        { type: 'uint128', value: 0 }, // Min amount out
        { type: 'principal', value: stacksAddress }, // Recipient
      ],
    };
  } catch (error) {
    console.error('Error building swap transaction:', error);
    throw error;
  }
}

/**
 * Execute swap transaction
 */
export async function executeSwap(
  txid: string,
  stacksAddress: string
): Promise<{
  status: string;
  txid: string;
}> {
  try {
    console.log('Executing swap:', txid);

    // Poll for transaction confirmation
    for (let i = 0; i < 60; i++) {
      const response = await axios.get(
        `${STACKS_API}/extended/v1/tx/${txid}`
      );

      console.log('TX status:', response.data.tx_status);

      if (response.data.tx_status === 'success') {
        return {
          status: 'success',
          txid,
        };
      }

      if (response.data.tx_status === 'abort_by_response' || 
          response.data.tx_status === 'abort_by_post_condition') {
        throw new Error('Transaction failed');
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    throw new Error('Transaction confirmation timeout');
  } catch (error) {
    console.error('Error executing swap:', error);
    throw error;
  }
}
