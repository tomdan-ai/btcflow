import { NextRequest, NextResponse } from 'next/server';

const MEMPOOL_API = 'https://mempool.space/testnet/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const apiPath = path.join('/');
    
    // Check network from header
    const network = request.headers.get('x-bitcoin-network') || 'testnet';
    let baseUrl = 'https://mempool.space/testnet/api';
    
    if (network === 'livenet' || network === 'mainnet') {
      baseUrl = 'https://mempool.space/api';
    } else if (network === 'signet') {
      baseUrl = 'https://mempool.space/signet/api';
    } else if (network === 'testnet4') {
      baseUrl = 'https://mempool.space/testnet4/api';
    }
    
    const url = `${baseUrl}/${apiPath}`;
    console.log(`Proxying ${network} request to:`, url);
    
    let response;
    let lastError;
    const maxRetries = 2;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        break; // Success
      } catch (err) {
        lastError = err;
        console.warn(`Fetch attempt ${i + 1} failed for ${url}:`, err);
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        }
      }
    }
    
    if (!response) {
      throw lastError || new Error('Failed to fetch after retries');
    }
    
    if (!response.ok) {
      console.error('Mempool API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch from Mempool API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
