/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable react/prop-types */

/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable react/prop-types */

'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils'; // Ensure `cn` is well-tested for class merging and conditional classes.

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    value?: number; // Add explicit type for `value` to clarify its usage.
  }
>(({ className, value = 0, ...props }, ref) => {
  // Clamp the `value` to ensure it remains between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className='h-full bg-primary transition-transform'
        // Using `translateX` with clamped value to prevent invalid states.
        style={{ transform: `translateX(-${100 - clampedValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = 'Progress'; // Explicit display name for debugging purposes.

export { Progress };
