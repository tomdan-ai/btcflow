/**
 * Wallet detection utility
 * Helps identify which Bitcoin wallet is available
 */

export function detectAvailableWallets() {
  const wallets = {
    xverse: !!window.XverseProviders?.BitcoinProvider,
    unisat: !!window.unisat,
    btcProvider: !!window.btcProvider,
  };

  console.log('Available wallets:', wallets);
  console.log('Window.XverseProviders:', window.XverseProviders);
  console.log('Window.unisat:', window.unisat);
  console.log('Window.btcProvider:', window.btcProvider);

  return wallets;
}

export function getWalletProvider() {
  if (window.XverseProviders?.BitcoinProvider) {
    console.log('Using Xverse provider');
    return { type: 'xverse', provider: window.XverseProviders.BitcoinProvider };
  }

  if (window.unisat) {
    console.log('Using Unisat provider');
    return { type: 'unisat', provider: window.unisat };
  }

  if (window.btcProvider) {
    console.log('Using generic BTC provider');
    return { type: 'btcProvider', provider: window.btcProvider };
  }

  console.log('No wallet provider found');
  return null;
}
