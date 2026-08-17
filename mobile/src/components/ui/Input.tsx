import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radii, typography, shadows } from '../../theme/colors';

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  shadowless?: boolean;
  error?: boolean;
  success?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  style, 
  icon,
  rightIcon,
  shadowless = false,
  error,
  success,
  onFocus,
  onBlur,
  ...props 
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  
  const getBorderColor = () => {
    if (error) return colors.danger;
    if (success) return colors.success;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  return (
    <View style={[
      styles.container,
      { 
        backgroundColor: colors.card, 
        borderColor: getBorderColor(),
        borderWidth: isFocused ? 1.5 : 1,
      },
      !shadowless && shadows.soft,
      style
    ]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput 
        style={[
          styles.input,
          typography.body,
          { color: colors.text }
        ]}
        placeholderTextColor={colors.textMuted}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    height: 52,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  rightIconContainer: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  } as any
});
