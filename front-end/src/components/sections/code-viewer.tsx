/* eslint-disable sonarjs/no-duplicate-string */

import React from 'react';
import { toast } from 'react-toastify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { copyToClipboard, isClipboardApiSupported } from '@/lib/clipboard';
import downloadContent from '@/lib/download';

import CopyButton from '../copy-button';
import DownloadButton from '../download-button';
import SectionContainer from './container';

interface ISmartContractCodeSection {
  chainsName: string;
  smartContractCode: string;
  smartContractFileExtension: string;
}

export default function CodeViewerSection({
  chainsName,
  smartContractCode,
  smartContractFileExtension
}: ISmartContractCodeSection) {
  const handleCopy = async () => {
    try {
      await copyToClipboard(smartContractCode);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy code!');
    }
  };

  const handleDownload = () => {
    try {
      downloadContent(
        smartContractCode,
        `smart-contract${smartContractFileExtension}`,
        'text/plain'
      );
      toast.success('File downloaded successfully!');
    } catch {
      toast.error('Failed to download the file!');
    }
  };

  return (
    <SectionContainer>
      <div className="flex flex-col items-start justify-between md:flex-row">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl">Smart Contract Code</h3>
          <h4 className="text-base font-medium text-muted-foreground md:text-lg">
            View the smart contract for your {chainsName} project
          </h4>
        </div>
      </div>

      <div className="relative">
        <SyntaxHighlighter
          language="solidity"
          style={dracula}
          className="mt-5 h-96 w-full rounded-3xl"
        >
          {smartContractCode}
        </SyntaxHighlighter>

        {isClipboardApiSupported && (
          <CopyButton
            onClick={handleCopy}
            buttonClassName="absolute right-20 top-5"
            aria-label="Copy smart contract code"
          />
        )}

        <DownloadButton
          size="icon"
          variant="outline"
          className="absolute right-5 top-5"
          onButtonClick={handleDownload}
          aria-label="Download smart contract code"
        />
      </div>
    </SectionContainer>
  );
}
