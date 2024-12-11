import React from 'react';

import type { ButtonProperties } from '../ui/button';

import { ClipboardCopy, ExternalLink, LogOut, RefreshCw } from 'lucide-react';

import { useToast } from '@/components/ui/toast/use-toast';
import { copyToClipboard, isClipboardApiSupported } from '@/lib/clipboard';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { ENetwoks } from './wallet';

interface IWalletDetails extends ButtonProperties {
  isMainnet: boolean;
  walletName: string;
  address: string;
  onWalletChangeNetwork: () => void;
  onWalletDisconnect: () => void;
}

function getExplorerLink(isMainnet: boolean, address: string) {
  const baseUrl = isMainnet ? 'https://starkscan.co' : 'https://testnet.starkscan.co';
  return `${baseUrl}/contract/${address}`;
}

export function WalletDetails({
  isMainnet,
  walletName,
  address,
  onWalletChangeNetwork,
  onWalletDisconnect,
  ...buttonProperties
}: IWalletDetails) {
  const { toast } = useToast();

  const displayAddress = `${address.slice(0, 6)}...${address.slice(-6)}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button {...buttonProperties}>{displayAddress}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-64'>
        <DropdownMenuLabel>Connected Wallet Details</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className='flex justify-between'>
              <span>Wallet:</span>
              <span className='text-muted-foreground'>{walletName}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuLabel>
            <div className='flex justify-between'>
              <span>Network:</span>
              <span className='text-muted-foreground'>
                {isMainnet ? ENetwoks.mainnet : ENetwoks.testnet}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onWalletChangeNetwork}>
          <RefreshCw className='mr-2 h-4 w-4' />
          <span>Switch to {isMainnet ? ENetwoks.testnet : ENetwoks.mainnet}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            window.open(getExplorerLink(isMainnet, address), '_blank');
          }}
        >
          <ExternalLink className='mr-2 h-4 w-4' />
          <span>View on Explorer</span>
        </DropdownMenuItem>
        {isClipboardApiSupported && (
          <DropdownMenuItem
            onClick={async () => {
              await copyToClipboard(address);

              toast({
                title: 'Copied to Clipboard',
                description: 'Wallet address copied successfully!'
              });
            }}
          >
            <ClipboardCopy className='mr-2 h-4 w-4' />
            <span>Copy Address</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className='text-destructive focus:text-destructive'
          onClick={onWalletDisconnect}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
