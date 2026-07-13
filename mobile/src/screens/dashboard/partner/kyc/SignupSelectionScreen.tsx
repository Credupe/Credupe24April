import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { SignupOptionsList } from "../../../../components/SignupOptionsList";
import { RootStackParamList } from "../../../../../App";
import { useTheme } from "../../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "SignupSelection">;

export const SignupSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const options = useMemo(
    () => ["Proprietorship", "Individual", "Partnership", "Pvt Ltd"],
    []
  );

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (value: string) => setSelectedOption(value);

  const handleContinue = () => {
    if (!selectedOption) return;
    navigation.navigate("SignupBasicDetails", { businessType: selectedOption });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image source={require("../../../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.title, typography.h1, { color: colors.text }]}>Create your account</Text>
            <Text style={[styles.subtitle, typography.body, { color: colors.textMuted }]}>Choose one business type to continue</Text>
          </View>

          <View style={styles.listWrap}>
            <SignupOptionsList
              options={options}
              selectedOption={selectedOption}
              onSelect={handleSelect}
            />
          </View>

          <Pressable
            style={[
              styles.continueBtn,
              {
                backgroundColor: colors.primary,
                opacity: selectedOption ? 1 : 0.6,
              },
            ]}
            disabled={!selectedOption}
            onPress={handleContinue}
          >
            <Text style={[styles.continueText, { color: colors.textInverted }]}>Continue</Text>
            <Text style={[styles.continueArrow, { color: colors.textInverted }]}>→</Text>
          </Pressable>

        
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logo: {
    width: 74,
    height: 74,
    marginBottom: spacing.md,
  },
  title: {
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: "center",
  },
  listWrap: {
    marginBottom: spacing.lg,
  },
  continueBtn: {
    borderRadius: radii.pill,
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  continueText: {
    fontSize: 18,
    fontWeight: "800",
  },
  continueArrow: {
    position: "absolute",
    right: spacing.xl,
    fontSize: 22,
    fontWeight: "700",
  },
  signinRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signinText: {
    ...typography.body,
  },
  signinLink: {
    ...typography.body,
    fontWeight: "800",
  },
});
