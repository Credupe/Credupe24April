import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { typography } from '../../theme/colors';

export interface TextProps extends RNTextProps {
  variant?: keyof typeof typography;
  color?: string;
  muted?: boolean;
  center?: boolean;
  bold?: boolean;
}

export const Text: React.FC<TextProps> = ({ 
  style, 
  variant = 'body', 
  color, 
  muted, 
  center, 
  bold, 
  children, 
  ...props 
}) => {
  const { colors } = useTheme();
  
  return (
    <RNText 
      style={[
        typography[variant],
        { color: color || (muted ? colors.textMuted : colors.text) },
        center && { textAlign: 'center' },
        bold && { fontWeight: '700' },
        style
      ]} 
      {...props}
    >
      {children}
    </RNText>
  );
};
