import { createConfig, configureChains } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

const { chains, publicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'DeFi Smart Money Tracker',
      },
    }),
  ],
  publicClient,
});

export const supportedChains = chains;

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatBalance = (balance: string | number): string => {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  return num.toFixed(4);
};

export const getExplorerUrl = (chainId: number, hash: string): string => {
  const chain = chains.find((c) => c.id === chainId);
  if (!chain) return '';
  return `${chain.blockExplorers.default.url}/tx/${hash}`;
};

export const getTokenExplorerUrl = (chainId: number, address: string): string => {
  const chain = chains.find((c) => c.id === chainId);
  if (!chain) return '';
  return `${chain.blockExplorers.default.url}/token/${address}`;
};

export const getAddressExplorerUrl = (chainId: number, address: string): string => {
  const chain = chains.find((c) => c.id === chainId);
  if (!chain) return '';
  return `${chain.blockExplorers.default.url}/address/${address}`;
}; 