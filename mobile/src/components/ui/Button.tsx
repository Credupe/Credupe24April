import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radii, shadows } from '../../theme/colors';
import { Text } from './Text';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  shadowless?: boolean;
  loading?: boolean;
  title?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  style, 
  variant = 'primary', 
  size = 'md', 
  shadowless = false, 
  loading = false, 
  title, 
  icon,
  disabled,
  children,
  ...props 
}) => {
  const { colors } = useTheme();
  
  const getBackgroundColor = () => {
    if (disabled && variant !== 'ghost' && variant !== 'outline') return "#E2E8F0"; // Light gray
    if (variant === 'primary') return colors.primary;
    if (variant === 'secondary') return colors.card;
    if (variant === 'outline' || variant === 'ghost') return 'transparent';
    return colors.primary;
  };
  
  const getTextColor = () => {
    if (disabled) return "#A0AEC0"; // Gray text for disabled
    if (variant === 'primary') return colors.textInverted;
    if (variant === 'secondary') return colors.text;
    if (variant === 'outline') return colors.primary;
    if (variant === 'ghost') return colors.text;
    return colors.primary;
  };

  const getBorderColor = () => {
    if (variant === 'outline') return colors.primary;
    if (variant === 'secondary') return colors.border;
    return 'transparent';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.base,
        { backgroundColor: getBackgroundColor() },
        { borderColor: getBorderColor(), borderWidth: (variant === 'outline' || variant === 'secondary') ? 1 : 0 },
        !shadowless && variant !== 'ghost' && variant !== 'outline' && shadows.argon,
        disabled && styles.disabled,
        size === 'sm' && styles.sm,
        size === 'md' && styles.md,
        size === 'lg' && styles.lg,
        style
      ]} 
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : children ? children : (
        <>
          {icon && icon}
          {title && (
            <Text 
              variant="body" 
              bold 
              style={{ color: getTextColor(), marginLeft: icon ? 8 : 0 }}
            >
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.sm,
  },
  sm: { height: 36, paddingHorizontal: 12 },
  md: { height: 48, paddingHorizontal: 16 },
  lg: { height: 56, paddingHorizontal: 24 },
  disabled: { opacity: 0.6 }
});
