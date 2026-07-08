import React from "react";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";

export const UtilityToolScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Utility Tool</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
