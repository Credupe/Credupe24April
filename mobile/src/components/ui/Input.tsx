import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radii, typography, shadows } from '../../theme/colors';

export interface InputProps extends TextInputProps {
  icon?: React.ReactNode;
  shadowless?: boolean;
  error?: boolean;
  success?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  style, 
  icon,
  shadowless = false,
  error,
  success,
  ...props 
}) => {
  const { colors } = useTheme();
  
  const getBorderColor = () => {
    if (error) return colors.danger;
    if (success) return colors.success;
    return colors.border;
  };
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.card, borderColor: getBorderColor() },
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
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.sm,
    height: 48,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
  }
});
