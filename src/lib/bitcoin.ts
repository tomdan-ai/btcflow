import axios from 'axios';

// Use local API route to avoid CORS issues
const MEMPOOL_API = '/api/mempool';

export async function getBtcBalance(address: string, network: string = 'testnet'): Promise<number> {
  try {
    console.log('Fetching balance for address:', address, 'on', network);
    const url = `${MEMPOOL_API}/address/${address}`;
    console.log('API URL:', url);
    
    const response = await axios.get(url, {
      headers: {
        'x-bitcoin-network': network
      }
    });
    console.log('Mempool response:', response.data);
    
    const satoshis = response.data.chain_stats.funded_txo_sum - response.data.chain_stats.spent_txo_sum;
    const btc = satoshis / 100000000;
    console.log('Calculated balance:', btc, 'BTC');
    
    return btc;
  } catch (error) {
    console.error('Error fetching BTC balance:', error);
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      if (error.response?.data?.message) {
        console.error('Proxy Error Message:', error.response.data.message);
      }
    }
    return 0;
  }
}

export async function getTxConfirmations(txid: string): Promise<number> {
  try {
    const response = await axios.get(`${MEMPOOL_API}/tx/${txid}`);
    return response.data.status?.confirmed ? response.data.status.block_height : 0;
  } catch (error) {
    console.error('Error fetching tx confirmations:', error);
    return 0;
  }
}

export async function getTxStatus(txid: string): Promise<any> {
  try {
    const response = await axios.get(`${MEMPOOL_API}/tx/${txid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tx status:', error);
    return null;
  }
}
