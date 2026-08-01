import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radii, shadows } from '../../theme/colors';

export interface CardProps extends ViewProps {
  elevated?: boolean;
  shadowless?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  style, 
  elevated = true, 
  shadowless = false, 
  children, 
  ...props 
}) => {
  const { colors } = useTheme();
  
  return (
    <View 
      style={[
        styles.card,
        { backgroundColor: elevated ? colors.cardElevated : colors.card },
        { borderColor: colors.border },
        !shadowless && shadows.argon,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  }
});
