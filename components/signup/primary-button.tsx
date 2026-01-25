import React from 'react';
import { Text, TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import { cn } from '@/lib/utils';

type PrimaryButtonProps = TouchableOpacityProps & {
  title: string;
  className?: string;
  fullWidth?: boolean;
};

export function PrimaryButton({
  title,
  className,
  disabled,
  fullWidth = false,
  ...props
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        'flex-row justify-center items-center py-4 px-6 h-14 bg-signup-button-bg border-[0.5px] border-signup-button-border rounded-full',
        fullWidth ? 'w-full' : 'w-full max-w-[280px]',
        disabled && 'opacity-70',
        className
      )}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      <Text
        className={cn(
          'text-[15px] font-medium leading-[18px] text-center text-signup-title',
          disabled && 'opacity-80'
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
