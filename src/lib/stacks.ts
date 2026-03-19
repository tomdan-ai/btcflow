import { generateWallet } from '@stacks/wallet-sdk';
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';
import axios from 'axios';

const STACKS_API_TESTNET = 'https://api.testnet.hiro.so';
const STACKS_API_MAINNET = 'https://api.hiro.so';

export function getStacksNetwork(isTestnet: boolean) {
  return isTestnet ? STACKS_TESTNET : STACKS_MAINNET;
}

export async function generateStacksKeypair() {
  const wallet = await generateWallet({
    secretKey: '',
    password: '',
  });
  return wallet.accounts[0];
}

export async function getStacksBalance(
  address: string,
  isTestnet: boolean = true
): Promise<{ sbtc: number; stx: number }> {
  try {
    const apiUrl = isTestnet ? STACKS_API_TESTNET : STACKS_API_MAINNET;
    const response = await axios.get(`${apiUrl}/extended/v1/address/${address}/balances`);
    
    const sbtcBalance = response.data.sbtc?.balance || 0;
    const stxBalance = response.data.stx?.balance || 0;
    
    return {
      sbtc: parseInt(sbtcBalance) / 100000000,
      stx: parseInt(stxBalance) / 1000000,
    };
  } catch (error) {
    console.error('Error fetching Stacks balance:', error);
    return { sbtc: 0, stx: 0 };
  }
}
