import React, { useMemo, useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  Modal,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  User,
  CalendarDays,
  Mars,
  Venus,
  Transgender,
  ChevronRight,
  CheckCircle2,
} from "lucide-react-native";

import { RootStackParamList } from "../../../../../App";
import { useTheme } from "../../../../theme/ThemeProvider";
import { radii, spacing } from "../../../../theme/colors";
import { fetchPartnerProfile, PartnerProfile } from "../../../../api/credupe";
import { ActivityIndicator } from "react-native";

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

const FONT_FAMILY = Platform.select({
  ios: "SF Pro Display",
  android: "sans-serif-medium",
  default: "System",
});

// Helper to format date of birth display
const formatDate = (day: string | null, month: string | null, year: string | null) => {
  if (!day || !month || !year) return "Select date of birth";
  return `${day} ${month} ${year}`;
};

export const SignupBasicDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();

  const [fullName, setFullName] = useState("");
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | null>(null);
  
  // Custom Date Picker States
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [tempDay, setTempDay] = useState("1");
  const [tempMonth, setTempMonth] = useState("January");
  const [tempYear, setTempYear] = useState("2000");

  const selectedBusinessType = route.params?.businessType;

  const [loading, setLoading] = useState(true);
  const [partnerProfile, setPartnerProfile] = useState<PartnerProfile | null>(null);
  const [isKycComplete, setIsKycComplete] = useState(false);

  useEffect(() => {
    fetchPartnerProfile()
      .then((res) => {
        if (res.success && res.data?.profile) {
          const profile = res.data.profile;
          setPartnerProfile(profile);
          if (profile.kycStatus === "VERIFIED" || profile.kycStatus === "REJECTED" || profile.onboardingStep === "COMPLETE") {
            setIsKycComplete(true);
          }
          if (profile.contactPerson) {
            setFullName(profile.contactPerson);
          }
          if (profile.gender === "Male" || profile.gender === "Female" || profile.gender === "Other") {
            setGender(profile.gender);
          }
          if (profile.dob) {
            const parts = profile.dob.split("-");
            if (parts.length === 3) {
              setYear(parts[0]);
              const mIdx = parseInt(parts[1], 10) - 1;
              if (mIdx >= 0 && mIdx < 12) setMonth(MONTHS[mIdx]);
              setDay(String(parseInt(parts[2], 10)));
            }
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const isValid = useMemo(() => {
    return Boolean(fullName.trim()) && Boolean(month) && Boolean(day) && Boolean(year) && Boolean(gender);
  }, [fullName, month, day, year, gender]);

  const handleNext = () => {
    if (!isValid) return;

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

  const openDatePicker = () => {
    setTempDay(day || "1");
    setTempMonth(month || "January");
    setTempYear(year || "2000");
    setShowCustomDatePicker(true);
  };

  const renderCustomDatePicker = () => {
    if (!showCustomDatePicker) return null;

    return (
      <Modal
        transparent
        animationType="slide"
        visible={showCustomDatePicker}
        onRequestClose={() => setShowCustomDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowCustomDatePicker(false)} />
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Pressable onPress={() => setShowCustomDatePicker(false)} style={styles.modalHeaderBtn}>
                <Text style={[styles.modalCancelText, { color: colors.textMuted }]}>Cancel</Text>
              </Pressable>
              <Text style={[styles.modalTitleText, { color: colors.text }]}>Date of Birth</Text>
              <Pressable
                onPress={() => {
                  setDay(tempDay);
                  setMonth(tempMonth);
                  setYear(tempYear);
                  setShowCustomDatePicker(false);
                }}
                style={styles.modalHeaderBtn}
              >
                <Text style={[styles.modalConfirmText, { color: colors.primary }]}>Done</Text>
              </Pressable>
            </View>

            <View style={styles.pickerColumnsContainer}>
              {/* Day Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerColumnLabel}>Day</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.pickerScroll}>
                  {DAYS.map((d) => {
                    const isSelected = tempDay === d;
                    return (
                      <Pressable
                        key={d}
                        onPress={() => setTempDay(d)}
                        style={[
                          styles.pickerItem,
                          isSelected && { backgroundColor: colors.primaryMuted, borderRadius: 8 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            { color: isSelected ? colors.primary : colors.text },
                            isSelected && { fontWeight: "700" },
                          ]}
                        >
                          {d}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Month Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerColumnLabel}>Month</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.pickerScroll}>
                  {MONTHS.map((m) => {
                    const isSelected = tempMonth === m;
                    return (
                      <Pressable
                        key={m}
                        onPress={() => setTempMonth(m)}
                        style={[
                          styles.pickerItem,
                          isSelected && { backgroundColor: colors.primaryMuted, borderRadius: 8 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            { color: isSelected ? colors.primary : colors.text },
                            isSelected && { fontWeight: "700" },
                          ]}
                        >
                          {m.substring(0, 3)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Year Column */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerColumnLabel}>Year</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.pickerScroll}>
                  {YEARS.map((y) => {
                    const isSelected = tempYear === y;
                    return (
                      <Pressable
                        key={y}
                        onPress={() => setTempYear(y)}
                        style={[
                          styles.pickerItem,
                          isSelected && { backgroundColor: colors.primaryMuted, borderRadius: 8 },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            { color: isSelected ? colors.primary : colors.text },
                            isSelected && { fontWeight: "700" },
                          ]}
                        >
                          {y}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }]} edges={["top", "bottom"]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  if (isKycComplete) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: "#FFFFFF" }]} edges={["top", "bottom"]}>
        <View style={styles.headerContainer}>
          <Pressable onPress={navigation.goBack} hitSlop={12} style={styles.headerBackBtn}>
            <ArrowLeft size={24} color={colors.text} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={[styles.headerTitleText, { color: colors.text }]}>KYC &amp; Documents</Text>
            <Text style={[styles.headerSubtext, { color: colors.textMuted }]}>Verification Complete</Text>
          </View>
          <View style={styles.headerRightSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "stretch", paddingBottom: 40 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.completeCard}>
            <View style={styles.completeIconContainer}>
              <View style={styles.completeGlowBgCircle} />
              <CheckCircle2 size={64} color="#10B981" />
            </View>

            <Text style={styles.completeTitle}>KYC Complete</Text>
            <Text style={styles.completeSubtitle}>
              Your KYC verification is complete. Your account has been verified, enabling full partner access.
            </Text>

            <View style={styles.divider} />

            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Business Name</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{partnerProfile?.businessName || "N/A"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Partner Code</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{partnerProfile?.partnerCode || "N/A"}</Text>
              </View>
              {partnerProfile?.contactPerson ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Contact Person</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{partnerProfile.contactPerson}</Text>
                </View>
              ) : null}
              {partnerProfile?.panLast4 ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>PAN Card</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>******{partnerProfile.panLast4}</Text>
                </View>
              ) : null}
              {partnerProfile?.aadhaarLast4 ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Aadhaar Card</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>********{partnerProfile.aadhaarLast4}</Text>
                </View>
              ) : null}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status</Text>
                <View style={[
                  styles.verifiedBadge,
                  partnerProfile?.kycStatus === "VERIFIED" ? styles.badgeSuccess :
                  partnerProfile?.kycStatus === "REJECTED" ? styles.badgeDanger :
                  styles.badgeWarning
                ]}>
                  <Text style={[
                    styles.verifiedBadgeText,
                    partnerProfile?.kycStatus === "VERIFIED" ? styles.textSuccess :
                    partnerProfile?.kycStatus === "REJECTED" ? styles.textDanger :
                    styles.textWarning
                  ]}>{partnerProfile?.kycStatus || "PENDING"}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.buttonWrap}>
            <GradientButton
              title="BACK TO DASHBOARD"
              onPress={() => {
                if (navigation.getState().routeNames.includes("Main")) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Main" as never }],
                  });
                } else {
                  navigation.goBack();
                }
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: "#FFFFFF" }]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={styles.safeArea} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScreenHeader onBack={navigation.goBack} currentStep={1} totalSteps={6} />
        <ProgressStepper currentStep={1} totalSteps={6} />

        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: "#FFFFFF" }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Tell us about yourself</Text>
            <Text style={styles.formSubtitle}>We need a few basic details to set up your verified profile.</Text>

            <View style={styles.inputSection}>
              <CustomTextField
                label="Name as per Aadhaar"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                icon={<User size={22} color={colors.primary} />}
              />
            </View>

            <View style={styles.inputSection}>
              <DatePickerField
                day={day}
                month={month}
                year={year}
                onPress={openDatePicker}
                icon={<CalendarDays size={22} color={colors.primary} />}
              />
            </View>

            <View style={styles.genderSection}>
              <Text style={[styles.genderTitle, { color: colors.text }]}>Select Gender</Text>
              <View style={styles.genderRow}>
                {GENDERS.map((item) => (
                  <GenderCard
                    key={item}
                    label={item}
                    isSelected={gender === item}
                    onPress={() => setGender(item)}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.buttonWrap}>
            <GradientButton
              title="NEXT"
              onPress={handleNext}
              disabled={!isValid}
              icon={<ChevronRight size={20} color="#FFFFFF" />}
            />
          </View>
        </ScrollView>
        {renderCustomDatePicker()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* ==========================================
   Reusable UI Components
   ========================================== */

// 1. ScreenHeader
const ScreenHeader: React.FC<{
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}> = ({ onBack, currentStep, totalSteps }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={onBack} hitSlop={12} style={styles.headerBackBtn}>
        <ArrowLeft size={24} color={colors.text} />
      </Pressable>
      <View style={styles.headerTitleWrap}>
        <Text style={[styles.headerTitleText, { color: colors.text }]}>Basic Details</Text>
        <Text style={[styles.headerSubtext, { color: colors.textMuted }]}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>
      <View style={styles.headerRightSpacer} />
    </View>
  );
};

// 2. ProgressStepper
const ProgressStepper: React.FC<{
  currentStep: number;
  totalSteps: number;
}> = ({ currentStep, totalSteps }) => {
  const { colors } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: (currentStep - 1) / (totalSteps - 1),
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [currentStep, totalSteps]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.stepperContainer}>
      <View style={[styles.stepperTrack, { backgroundColor: colors.border }]} />
      <Animated.View
        style={[
          styles.stepperActiveLine,
          {
            backgroundColor: colors.primary,
            width: progressWidth,
          },
        ]}
      />
      <View style={styles.stepperDotsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < currentStep - 1;
          const isActive = index === currentStep - 1;

          return (
            <View
              key={index}
              style={[
                styles.stepDot,
                {
                  backgroundColor: isActive
                    ? colors.primary
                    : isCompleted
                    ? colors.primary
                    : "#FFFFFF",
                  borderColor: isActive || isCompleted ? colors.primary : colors.border,
                  transform: [{ scale: isActive ? 1.25 : 1.0 }],
                },
              ]}
            >
              {isCompleted && (
                <CheckCircle2 size={8} color="#FFFFFF" />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

// 3. CustomTextField
const CustomTextField: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
}> = ({ label, value, onChangeText, placeholder, icon }) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isActive = isFocused || value.length > 0;

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      style={[
        styles.textFieldContainer,
        {
          borderColor: isFocused ? colors.primary : colors.border,
          backgroundColor: "#FFFFFF",
        },
      ]}
    >
      {icon && <View style={styles.textFieldIcon}>{icon}</View>}
      <View style={styles.textFieldContent}>
        {isActive && (
          <Text style={[styles.textFieldLabelSmall, { color: isFocused ? colors.primary : colors.textMuted }]}>
            {label}
          </Text>
        )}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isActive ? placeholder : label}
          placeholderTextColor={colors.textMuted}
          style={[
            isActive ? styles.textFieldInputActive : styles.textFieldInputInactiveText,
            { color: colors.text }
          ]}
        />
      </View>
    </Pressable>
  );
};

// 4. DatePickerField
const DatePickerField: React.FC<{
  day: string | null;
  month: string | null;
  year: string | null;
  onPress: () => void;
  icon?: React.ReactNode;
}> = ({ day, month, year, onPress, icon }) => {
  const { colors } = useTheme();
  const hasValue = Boolean(day && month && year);

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.datePickerContainer,
        {
          borderColor: colors.border,
          backgroundColor: "#FFFFFF",
        },
      ]}
    >
      {icon && <View style={styles.datePickerIcon}>{icon}</View>}
      <View style={styles.datePickerContent}>
        {hasValue ? (
          <View style={styles.inputActiveContainer}>
            <Text style={[styles.textFieldLabelSmall, { color: colors.textMuted }]}>
              Date of Birth
            </Text>
            <Text style={[styles.datePickerValue, { color: colors.text }]}>
              {formatDate(day, month, year)}
            </Text>
          </View>
        ) : (
          <View style={styles.inputInactiveContainer}>
            <Text style={[styles.textFieldLabelLarge, { color: colors.textMuted }]}>
              Date of Birth
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

// 5. GenderCard Selection
const GenderCard: React.FC<{
  label: "Male" | "Female" | "Other";
  isSelected: boolean;
  onPress: () => void;
}> = ({ label, isSelected, onPress }) => {
  const { colors } = useTheme();
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: isSelected ? 1.05 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  }, [isSelected]);

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: isSelected ? 1.05 : 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  const getIcon = () => {
    const size = 28;
    const color = isSelected ? "#FFFFFF" : colors.primary;
    switch (label) {
      case "Male":
        return <Mars size={size} color={color} />;
      case "Female":
        return <Venus size={size} color={color} />;
      case "Other":
        return <Transgender size={size} color={color} />;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1 }}
    >
      <Animated.View
        style={[
          styles.genderCardItem,
          {
            borderColor: isSelected ? colors.primary : colors.border,
            backgroundColor: isSelected ? colors.primary : colors.primaryMuted,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {getIcon()}
        <Text
          style={[
            styles.genderCardText,
            { color: isSelected ? "#FFFFFF" : colors.text },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

// 6. GradientButton
const GradientButton: React.FC<{
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}> = ({ title, onPress, disabled, icon }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.timing(scaleValue, {
      toValue: 0.96,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 6,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={styles.gradientButtonPressable}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }], width: "100%" }}>
        <LinearGradient
          colors={disabled ? ["#E5E7EB", "#D1D5DB"] : ["#8B5CF6", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientButtonContainer, disabled && styles.gradientButtonDisabled]}
        >
          <View style={styles.gradientButtonContent}>
            <Text style={[styles.gradientButtonText, disabled && styles.gradientButtonTextDisabled]}>
              {title}
            </Text>
            {icon && <View style={styles.gradientButtonIcon}>{icon}</View>}
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

/* ==========================================
   Styles System
   ========================================== */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: spacing.xl,
    backgroundColor: "#FFFFFF",
  },
  // Header styles
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FAFAFC",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#E5E7EB",
    borderWidth: 1,
  },
  headerTitleWrap: {
    flex: 1,
    paddingLeft: 16,
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
  },
  headerSubtext: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 2,
    fontFamily: FONT_FAMILY,
  },
  headerRightSpacer: {
    width: 40,
  },
  // Stepper styles
  stepperContainer: {
    height: 20,
    marginHorizontal: 24,
    marginVertical: 12,
    justifyContent: "center",
  },
  stepperTrack: {
    height: 2,
    borderRadius: 1,
    width: "100%",
    position: "absolute",
  },
  stepperActiveLine: {
    height: 2,
    borderRadius: 1,
    position: "absolute",
  },
  stepperDotsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  // Form layout
  formCard: {
    marginTop: 12,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B1B1F",
    fontFamily: FONT_FAMILY,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    fontFamily: FONT_FAMILY,
    lineHeight: 22,
    marginBottom: 28,
  },
  inputSection: {
    marginBottom: 20,
  },
  // Custom text field
  textFieldContainer: {
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  textFieldIcon: {
    marginRight: 12,
  },
  textFieldContent: {
    flex: 1,
    justifyContent: "center",
  },
  inputActiveContainer: {
    justifyContent: "center",
  },
  inputInactiveContainer: {
    justifyContent: "center",
  },
  textFieldLabelSmall: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
    marginBottom: 2,
  },
  textFieldLabelLarge: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
  },
  textFieldInputActive: {
    height: Platform.OS === "android" ? 32 : 24,
    fontSize: 17,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
    padding: 0,
    paddingVertical: 0,
    textAlignVertical: "center",
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none",
        outlineWidth: 0,
      },
    }),
  } as any,
  textFieldInputInactiveText: {
    height: 40,
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
    padding: 0,
    paddingVertical: 0,
    textAlignVertical: "center",
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none",
        outlineWidth: 0,
      },
    }),
  } as any,
  // Date Picker
  datePickerContainer: {
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  datePickerIcon: {
    marginRight: 12,
  },
  datePickerContent: {
    flex: 1,
    justifyContent: "center",
  },
  datePickerValue: {
    fontSize: 17,
    fontWeight: "500",
    fontFamily: FONT_FAMILY,
    marginTop: 2,
  },
  // Gender section
  genderSection: {
    marginTop: 12,
    marginBottom: 20,
  },
  genderTitle: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
    marginBottom: 12,
  },
  genderRow: {
    flexDirection: "row",
    gap: 12,
  },
  genderCardItem: {
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    minHeight: 104,
  },
  genderCardText: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
    marginTop: 8,
  },
  // Button Wrap
  buttonWrap: {
    marginTop: spacing.xl,
  },
  // Gradient Button
  gradientButtonPressable: {
    width: "100%",
    borderRadius: 30,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  gradientButtonContainer: {
    height: 58,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  gradientButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
    letterSpacing: 0.5,
  },
  gradientButtonTextDisabled: {
    color: "#9CA3AF",
  },
  gradientButtonIcon: {
    marginLeft: 8,
  },
  // Custom Date Picker Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  modalHeaderBtn: {
    padding: 4,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
  },
  modalTitleText: {
    fontSize: 17,
    fontWeight: "700",
    fontFamily: FONT_FAMILY,
  },
  pickerColumnsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 240,
    justifyContent: "space-between",
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "stretch",
  },
  pickerColumnLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.0,
  },
  pickerScroll: {
    flex: 1,
  },
  pickerItem: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY,
  },
  completeCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 20,
  },
  completeIconContainer: {
    position: "relative",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  completeGlowBgCircle: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    fontFamily: FONT_FAMILY,
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: FONT_FAMILY,
    lineHeight: 20,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    width: "100%",
    marginBottom: 20,
  },
  infoList: {
    width: "100%",
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  verifiedBadge: {
    backgroundColor: "#EAFBF0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E9E52",
  },
  verifiedBadgeText: {
    color: "#1E9E52",
    fontSize: 11,
    fontWeight: "800",
  },
  badgeSuccess: {
    backgroundColor: "#EAFBF0",
    borderColor: "#1E9E52",
  },
  badgeWarning: {
    backgroundColor: "#FFF9E6",
    borderColor: "#F5A623",
  },
  badgeDanger: {
    backgroundColor: "#FCE8E6",
    borderColor: "#E74C3C",
  },
  textSuccess: {
    color: "#1E9E52",
  },
  textWarning: {
    color: "#F5A623",
  },
  textDanger: {
    color: "#E74C3C",
  },
});
