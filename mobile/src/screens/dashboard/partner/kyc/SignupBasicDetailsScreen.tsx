import React, { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../../../../App";
import { useTheme } from "../../../../theme/ThemeProvider";
import { radii, spacing, typography } from "../../../../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "SignupBasicDetails">;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 90 }, (_, i) => String(CURRENT_YEAR - i));

const GENDERS: Array<"Male" | "Female" | "Other"> = ["Male", "Female", "Other"];
const GENDER_ICONS: Record<"Male" | "Female" | "Other", string> = {
  Male: "👨",
  Female: "👩",
  Other: "🧑",
};

export const SignupBasicDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();

  const [fullName, setFullName] = useState("");
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | null>(null);
  const [openPicker, setOpenPicker] = useState<"month" | "day" | "year" | null>(null);

  const selectedBusinessType = route.params?.businessType;

  const isValid = useMemo(() => {
    return Boolean(fullName.trim()) && Boolean(month) && Boolean(day) && Boolean(year) && Boolean(gender);
  }, [fullName, month, day, year, gender]);

  const handleNext = () => {
    if (!isValid) {
      return;
    }

    navigation.navigate("SignupKycDocuments", {
      businessType: selectedBusinessType,
      basicDetails: {
        fullName: fullName.trim(),
        month,
        day,
        year,
        gender,
      },
    });
  };

  const closePicker = () => setOpenPicker(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.bg }]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerWrap}>
            <View style={styles.headerBar}>
              <Pressable onPress={navigation.goBack} hitSlop={8} style={styles.backButton}>
                <Text style={styles.backText}>‹</Text>
              </Pressable>
              <Text style={styles.headerTitle}>Basic details</Text>
              <View style={styles.headerSpacer} />
            </View>
          </View>

          <View style={styles.progressRow}>
            {Array.from({ length: 7 }).map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: idx === 0 ? colors.primary : "#D7D7D7",
                  },
                ]}
              />
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>Name as per Aadhaar</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.question, { color: colors.text }]}>What’s your date of birth</Text>
            <View style={styles.dobRow}>
              <Selector
                label={month ?? "Month"}
                onPress={() => setOpenPicker(openPicker === "month" ? null : "month")}
              />
              <Selector
                label={day ?? "Date"}
                onPress={() => setOpenPicker(openPicker === "day" ? null : "day")}
              />
              <Selector
                label={year ?? "Year"}
                onPress={() => setOpenPicker(openPicker === "year" ? null : "year")}
              />
            </View>
          </View>

          {openPicker ? (
            <View style={[styles.dropdown, { borderColor: colors.border }]}> 
              <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                {(openPicker === "month" ? MONTHS : openPicker === "day" ? DAYS : YEARS).map((item) => (
                  <Pressable
                    key={item}
                    style={styles.dropdownItem}
                    onPress={() => {
                      if (openPicker === "month") setMonth(item);
                      if (openPicker === "day") setDay(item);
                      if (openPicker === "year") setYear(item);
                      closePicker();
                    }}
                  >
                    <Text style={[styles.dropdownText, { color: colors.text }]}>{item}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={[styles.question, { color: colors.text }]}>Select Gender</Text>
            <View style={styles.genderRow}>
              {GENDERS.map((item) => {
                const isSelected = gender === item;
                return (
                  <Pressable
                    key={item}
                    style={[
                      styles.genderCard,
                      {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? "#F5F0FF" : "#FFFFFF",
                      },
                    ]}
                    onPress={() => setGender(item)}
                  >
                    <Text style={styles.genderIconEmoji}>{GENDER_ICONS[item]}</Text>
                    <Text style={[styles.genderText, { color: colors.text }]}>{item}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            style={[
              styles.nextBtn,
              {
                backgroundColor: colors.primary,
                opacity: isValid ? 1 : 0.6,
              },
            ]}
            disabled={!isValid}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>NEXT</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Selector: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => {
  return (
    <Pressable style={styles.selector} onPress={onPress}>
      <Text style={styles.selectorText}>{label}</Text>
      <Text style={styles.selectorArrow}>▾</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  headerWrap: {
    backgroundColor: "#111111",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 34,
    fontWeight: "400",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 32,
  },
  progressRow: {
    marginTop: 18,
    marginBottom: 22,
    paddingHorizontal: spacing.xl,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressBar: {
    width: 34,
    height: 6,
    borderRadius: radii.pill,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: 22,
  },
  label: {
    ...typography.body,
    fontSize: 33,
    marginBottom: 10,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 32,
  },
  question: {
    ...typography.h1,
    fontSize: 46,
    marginBottom: 14,
    fontWeight: "600",
  },
  dobRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  selector: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#B8B8B8",
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorText: {
    fontSize: 22,
    color: "#3A3A3A",
  },
  selectorArrow: {
    color: "#4B4B4B",
    fontSize: 18,
    lineHeight: 18,
  },
  dropdown: {
    marginHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radii.md,
    maxHeight: 200,
    backgroundColor: "#FFFFFF",
    marginBottom: spacing.md,
  },
  dropdownScroll: {
    maxHeight: 180,
  },
  dropdownItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: "500",
  },
  genderRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  genderCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    minHeight: 118,
  },
  genderIconEmoji: {
    fontSize: 38,
    lineHeight: 42,
    marginBottom: 8,
  },
  genderText: {
    fontSize: 17,
    fontWeight: "500",
  },
  nextBtn: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },
});
