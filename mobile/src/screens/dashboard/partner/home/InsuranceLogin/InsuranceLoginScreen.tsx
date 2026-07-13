import React from "react";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../../App";
import styles from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "InsuranceLogin">;

export const InsuranceLoginScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Insurance Login</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
        <Pressable style={styles.button} onPress={() => navigation.goBack()} accessibilityRole="button">
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};
