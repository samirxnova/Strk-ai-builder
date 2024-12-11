import React from 'react';

import type { ButtonProperties } from '../ui/button';

import { Button } from '../ui/button';

interface IWalletConnect extends ButtonProperties {
  onWalletConnect: () => void;
}

export function WalletConnect({ onWalletConnect, children = 'Connect Wallet', ...buttonProperties }: IWalletConnect) {
  return (
    <Button onClick={onWalletConnect} {...buttonProperties}>
      {children}
    </Button>
  );
}
