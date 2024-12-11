import React from 'react';

import { Check, Loader2, X } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IStep {
  number: number;
  step: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isStepConnected: boolean;
}

interface IContractCreationSteps {
  steps: IStep[];
}

export default function ContractCreationSteps({ steps }: IContractCreationSteps) {
  return (
    <ul className='flex flex-col items-start gap-5 md:flex-row md:items-center'>
      {steps.map((step, index) => (
        <li key={step.number} className='relative flex flex-col items-center justify-center gap-y-2'>
          <div
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-secondary bg-secondary text-sm font-bold transition-colors',
              {
                'bg-primary text-primary-foreground border-primary': step.isSuccess,
                'bg-destructive text-destructive-foreground border-destructive': step.isError,
                'text-muted-foreground': !step.isSuccess && !step.isError && !step.isLoading
              }
            )}
          >
            {step.isLoading ? (
              <Loader2 className='h-6 w-6 animate-spin' />
            ) : step.isSuccess ? (
              <Check className='h-6 w-6' />
            ) : step.isError ? (
              <X className='h-6 w-6' />
            ) : (
              <span>{step.number}</span>
            )}
          </div>

          <span className='text-center text-sm font-medium text-muted-foreground md:text-base'>
            {step.step}
          </span>

          {step.isStepConnected && index < steps.length - 1 && (
            <span
              className={cn(
                'absolute top-1/2 left-10 h-1 w-16 md:w-24 -translate-y-1/2 bg-secondary transition-colors',
                {
                  'bg-primary': steps[index + 1]?.isSuccess,
                  'bg-destructive': steps[index + 1]?.isError
                }
              )}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
