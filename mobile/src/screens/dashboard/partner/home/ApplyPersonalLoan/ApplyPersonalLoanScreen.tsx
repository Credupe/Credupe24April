import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Share,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../../../App";
import { apiFetch, fetchLenders, Lender } from "../../../../../api/credupe";
import { useTheme } from "../../../../../theme/ThemeProvider";
import Toast from "react-native-toast-message";
import styles from "./styles";

type Props = NativeStackScreenProps<RootStackParamList, "ApplyPersonalLoan">;

const EMPLOYMENT_OPTIONS = [
  { label: "Salaried", value: "SALARIED" },
  { label: "Self Employed", value: "SELF_EMPLOYED" },
  { label: "Business", value: "BUSINESS" },
  { label: "Freelancer", value: "FREELANCER" },
  { label: "Unemployed", value: "UNEMPLOYED" },
  { label: "Student", value: "STUDENT" },
];

export const ApplyPersonalLoanScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();

  // Screen States
  const [selectedBank, setSelectedBank] = useState<Lender | null>(null);
  const [dbLenders, setDbLenders] = useState<Lender[]>([]);
  const [loadingLenders, setLoadingLenders] = useState(true);

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState(""); // DD-MM-YYYY
  const [pan, setPan] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "">("");
  const [fathersFirstName, setFathersFirstName] = useState("");
  const [fathersLastName, setFathersLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [employmentType, setEmploymentType] = useState<string>("");

  // UI States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Fetch lenders on load
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchLenders();
        if (res.success && res.data?.items) {
          setDbLenders(res.data.items);
        }
      } catch (err) {
        console.warn("Could not load lenders:", err);
      } finally {
        setLoadingLenders(false);
      }
    })();
  }, []);

  // Format DOB input automatically with dashes (DD-MM-YYYY)
  const handleDobChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 8)}`;
    }
    
    setDob(formatted.slice(0, 10));
  };

  // Safe UTM copy function
  const handleCopyUTM = async (bank: Lender) => {
    let partnerCode = "CRD-PA00000";
    try {
      const res = await apiFetch<{ profile: { partnerCode: string } | null }>("/partners/me");
      if (res.success && res.data?.profile?.partnerCode) {
        partnerCode = res.data.profile.partnerCode;
      }
    } catch (e) {
      console.warn("Could not fetch partner profile, using default:", e);
    }

    const utmLink = `https://credupe.com/apply/personal-loan?bank=${bank.slug}&partner=${partnerCode}`;

    try {
      let success = false;
      if (Platform.OS === "web") {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(utmLink);
          success = true;
        }
      } else {
        try {
          const NativeClipboard = require("react-native").Clipboard;
          if (NativeClipboard && typeof NativeClipboard.setString === "function") {
            NativeClipboard.setString(utmLink);
            success = true;
          }
        } catch (e) {
          // Native module not found
        }
      }

      if (success) {
        Toast.show({
          type: "success",
          text1: "UTM Copied!",
          text2: `${bank.name} UTM copied to clipboard.`,
        });
      } else {
        await Share.share({
          message: `Apply for Personal Loan with ${bank.name} here: ${utmLink}`,
          title: `Share UTM Link`,
        });
      }
    } catch (err) {
      console.error("Failed to copy/share UTM link:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Unable to copy or share the UTM link.",
      });
    }
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile No. is required";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit Mobile No.";
    }

    if (!dob.trim()) {
      newErrors.dob = "DOB is required";
    } else if (!/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
      newErrors.dob = "Format must be DD-MM-YYYY";
    } else {
      const parts = dob.split("-");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      const dateObj = new Date(year, month - 1, day);
      if (
        isNaN(dateObj.getTime()) ||
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getDate() !== day
      ) {
        newErrors.dob = "Enter a valid calendar date";
      }
    }

    if (!pan.trim()) {
      newErrors.pan = "PAN is required";
    } else if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/i.test(pan)) {
      newErrors.pan = "Enter a valid PAN card number (e.g. ABCDE1234F)";
    }

    if (!gender) newErrors.gender = "Gender is required";
    if (!fathersFirstName.trim()) newErrors.fathersFirstName = "Father's First Name is required";
    if (!fathersLastName.trim()) newErrors.fathersLastName = "Father's Last Name is required";
    if (!addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!addressLine2.trim()) newErrors.addressLine2 = "Address Line 2 is required";

    if (!pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(pincode)) {
      newErrors.pincode = "Enter a valid 6-digit Pincode";
    }

    if (!employmentType) newErrors.employmentType = "Employment type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Application Form
  const handleSubmit = async () => {
    if (!validateForm() || !selectedBank) return;

    setSubmitting(true);

    const submissionData = {
      loanType: "PERSONAL_LOAN",
      amount: 100000, 
      tenureMonths: 12, 
      lenderId: selectedBank.id,
      formData: {
        firstName,
        lastName,
        mobile,
        dob,
        pan: pan.toUpperCase(),
        gender,
        fathersFirstName,
        fathersLastName,
        addressLine1,
        addressLine2,
        pincode,
        employmentType,
        bankName: selectedBank.name,
      },
    };

    try {
      const res = await apiFetch<{ id: string; referenceNo: string; status: string }>(
        "/loan-applications",
        {
          method: "POST",
          body: JSON.stringify(submissionData),
        }
      );

      if (res.success && res.data) {
        Toast.show({
          type: "success",
          text1: "Application Submitted!",
          text2: `Application Ref: ${res.data.referenceNo}`,
        });
        
        setFirstName("");
        setLastName("");
        setMobile("");
        setDob("");
        setPan("");
        setGender("");
        setFathersFirstName("");
        setFathersLastName("");
        setAddressLine1("");
        setAddressLine2("");
        setPincode("");
        setEmploymentType("");
        setErrors({});
        setSelectedBank(null);
      } else {
        Toast.show({
          type: "error",
          text1: "Submission Failed",
          text2: res.error?.message?.join("\n") ?? "Try again later",
        });
      }
    } catch (err) {
      console.error("Form submission error:", err);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Network request failed. Please check your connection.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackPress = () => {
    if (selectedBank) {
      setSelectedBank(null);
    } else {
      navigation.goBack();
    }
  };

  const activeLenders = dbLenders.filter((l) => l.active !== false);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.card }]}>
      {/* Light Themed Header matching login page design styling */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
        <Pressable
          onPress={handleBackPress}
          style={styles.headerBackButton}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Text style={[styles.headerBackButtonText, { color: colors.primary }]}>←</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {selectedBank ? selectedBank.name : "List of Banks"}
        </Text>
      </View>

      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {!selectedBank ? (
          /* SCREEN 1: BANK LIST SCREEN */
          loadingLenders ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
          ) : (
            <ScrollView
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={[styles.listTitle, { color: colors.textMuted }]}>Choose Bank for PL</Text>
              {activeLenders.length === 0 ? (
                <View style={{ padding: 40, alignItems: "center" }}>
                  <Text style={{ color: colors.textMuted, textAlign: "center" }}>No active lenders available.</Text>
                </View>
              ) : (
                activeLenders.map((bank) => (
                  <View key={bank.id} style={[styles.bankCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.bankName, { color: colors.text }]}>{bank.name}</Text>
                    <View style={styles.buttonGroup}>
                      <Pressable
                        style={[styles.copyButton, { borderColor: colors.primary, backgroundColor: colors.card }]}
                        onPress={() => handleCopyUTM(bank)}
                        accessibilityRole="button"
                        accessibilityLabel={`Copy UTM for ${bank.name}`}
                      >
                        <Text style={[styles.copyButtonText, { color: colors.primary }]}>Copy UTM</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.applyButton, { backgroundColor: colors.primary }]}
                        onPress={() => {
                          setSelectedBank(bank);
                          setErrors({});
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={`Apply Now for ${bank.name}`}
                      >
                        <Text style={[styles.applyButtonText, { color: colors.textInverted }]}>Apply Now</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          )
        ) : (
          /* SCREEN 2: APPLICATION FORM SCREEN */
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView
              style={[styles.formScrollView, { backgroundColor: colors.bg }]}
              contentContainerStyle={styles.formScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.formContainerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                
                {/* Brand Header */}
                <View style={styles.cardBrandHeader}>
                  <Text style={[styles.applicationTitle, { color: colors.text, marginLeft: 0 }]}>
                    {selectedBank.name} Personal Loan Application
                  </Text>
                </View>

                {/* Step Circle Indicator */}
                <View style={styles.stepIndicatorContainer}>
                  <View style={[styles.stepCircle, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.stepCircleText, { color: colors.textInverted }]}>1</Text>
                  </View>
                  <Text style={[styles.stepLabel, { color: colors.text }]}>Personal Detail</Text>
                </View>

                <Text style={[styles.stepsSub, { color: colors.textMuted }]}>Steps 1/1</Text>
                <Text style={[styles.stepsTitle, { color: colors.text }]}>Personal Detail</Text>

                {/* Form Fields */}
                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    First Name <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.firstName ? styles.inputError : null]}
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (errors.firstName) setErrors({ ...errors, firstName: "" });
                    }}
                    placeholder="First Name"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                  {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    Last Name <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.lastName ? styles.inputError : null]}
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (errors.lastName) setErrors({ ...errors, lastName: "" });
                    }}
                    placeholder="Last Name"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                  {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    Mobile No. <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.mobile ? styles.inputError : null]}
                    value={mobile}
                    onChangeText={(text) => {
                      setMobile(text.replace(/\D/g, "").slice(0, 10));
                      if (errors.mobile) setErrors({ ...errors, mobile: "" });
                    }}
                    placeholder="Mobile No."
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                  />
                  {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    DOB (DD-MM-YYYY) <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.dob ? styles.inputError : null]}
                    value={dob}
                    onChangeText={(text) => {
                      handleDobChange(text);
                      if (errors.dob) setErrors({ ...errors, dob: "" });
                    }}
                    placeholder="DOB (DD-MM-YYYY)"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                  />
                  {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    PAN <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.pan ? styles.inputError : null]}
                    value={pan}
                    onChangeText={(text) => {
                      setPan(text.toUpperCase().slice(0, 10));
                      if (errors.pan) setErrors({ ...errors, pan: "" });
                    }}
                    placeholder="PAN"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="characters"
                  />
                  {errors.pan ? <Text style={styles.errorText}>{errors.pan}</Text> : null}
                </View>

                {/* Gender Radio Buttons */}
                <View style={styles.radioContainer}>
                  <Text style={[styles.radioLabel, { color: colors.textMuted }]}>
                    Gender <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <View style={styles.radioRow}>
                    <Pressable
                      style={styles.radioOption}
                      onPress={() => {
                        setGender("Male");
                        if (errors.gender) setErrors({ ...errors, gender: "" });
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: gender === "Male" }}
                    >
                      <View style={[styles.radioCircle, { borderColor: colors.border }, gender === "Male" ? { borderColor: colors.primary } : null]}>
                        {gender === "Male" ? <View style={[styles.radioDot, { backgroundColor: colors.primary }]} /> : null}
                      </View>
                      <Text style={[styles.radioText, { color: colors.text }]}>Male</Text>
                    </Pressable>

                    <Pressable
                      style={styles.radioOption}
                      onPress={() => {
                        setGender("Female");
                        if (errors.gender) setErrors({ ...errors, gender: "" });
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: gender === "Female" }}
                    >
                      <View style={[styles.radioCircle, { borderColor: colors.border }, gender === "Female" ? { borderColor: colors.primary } : null]}>
                        {gender === "Female" ? <View style={[styles.radioDot, { backgroundColor: colors.primary }]} /> : null}
                      </View>
                      <Text style={[styles.radioText, { color: colors.text }]}>Female</Text>
                    </Pressable>
                  </View>
                  {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    Father's First Name <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.fathersFirstName ? styles.inputError : null]}
                    value={fathersFirstName}
                    onChangeText={(text) => {
                      setFathersFirstName(text);
                      if (errors.fathersFirstName) setErrors({ ...errors, fathersFirstName: "" });
                    }}
                    placeholder="Father's First Name"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                  {errors.fathersFirstName ? <Text style={styles.errorText}>{errors.fathersFirstName}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    Father's Last Name <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.fathersLastName ? styles.inputError : null]}
                    value={fathersLastName}
                    onChangeText={(text) => {
                      setFathersLastName(text);
                      if (errors.fathersLastName) setErrors({ ...errors, fathersLastName: "" });
                    }}
                    placeholder="Father's Last Name"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                  {errors.fathersLastName ? <Text style={styles.errorText}>{errors.fathersLastName}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    Address Line 1 <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.addressLine1 ? styles.inputError : null]}
                    value={addressLine1}
                    onChangeText={(text) => {
                      setAddressLine1(text);
                      if (errors.addressLine1) setErrors({ ...errors, addressLine1: "" });
                    }}
                    placeholder="Address Line 1"
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.addressLine1 ? <Text style={styles.errorText}>{errors.addressLine1}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    Address Line 2 <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.addressLine2 ? styles.inputError : null]}
                    value={addressLine2}
                    onChangeText={(text) => {
                      setAddressLine2(text);
                      if (errors.addressLine2) setErrors({ ...errors, addressLine2: "" });
                    }}
                    placeholder="Address Line 2"
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.addressLine2 ? <Text style={styles.errorText}>{errors.addressLine2}</Text> : null}
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    Pincode <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }, errors.pincode ? styles.inputError : null]}
                    value={pincode}
                    onChangeText={(text) => {
                      setPincode(text.replace(/\D/g, "").slice(0, 6));
                      if (errors.pincode) setErrors({ ...errors, pincode: "" });
                    }}
                    placeholder="Pincode"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                  />
                  {errors.pincode ? <Text style={styles.errorText}>{errors.pincode}</Text> : null}
                </View>

                {/* Custom Employment Type Dropdown Input */}
                <View style={styles.inputWrapper}>
                  <Text style={[styles.inputLabel, { color: colors.textMuted }]}>
                    Select Employment type <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <Pressable
                    style={[styles.pickerPressable, { backgroundColor: colors.card, borderColor: colors.border }, errors.employmentType ? styles.inputError : null]}
                    onPress={() => setShowPicker(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Select Employment type"
                  >
                    <Text
                      style={
                        employmentType
                          ? [styles.pickerText, { color: colors.text }]
                          : [styles.pickerPlaceholder, { color: colors.textMuted }]
                      }
                    >
                      {employmentType
                        ? EMPLOYMENT_OPTIONS.find((o) => o.value === employmentType)?.label
                        : "Select Employment type"}
                    </Text>
                    <View style={[styles.caretIcon, { borderTopColor: colors.textMuted }]} />
                  </Pressable>
                  {errors.employmentType ? <Text style={styles.errorText}>{errors.employmentType}</Text> : null}
                </View>

                {/* Submit button */}
                <View style={styles.submitButtonRow}>
                  <Pressable
                    style={[
                      styles.submitButton,
                      { backgroundColor: colors.primary },
                      submitting ? styles.submitButtonDisabled : null,
                    ]}
                    onPress={handleSubmit}
                    disabled={submitting}
                    accessibilityRole="button"
                    accessibilityLabel="Submit Application"
                  >
                    {submitting ? (
                      <ActivityIndicator size="small" color={colors.textInverted} />
                    ) : (
                      <>
                        <Text style={[styles.submitButtonText, { color: colors.textInverted }]}>Submit</Text>
                        <Text style={{ color: colors.textInverted, fontSize: 14, fontWeight: "700" }}>→</Text>
                      </>
                    )}
                  </Pressable>
                </View>

              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </View>

      {/* Employment Type Custom Selection Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPicker(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Employment Type</Text>
              <Pressable
                onPress={() => setShowPicker(false)}
                style={styles.modalCloseButton}
              >
                <Text style={[styles.modalCloseText, { color: colors.textMuted }]}>✕</Text>
              </Pressable>
            </View>

            <FlatList
              data={EMPLOYMENT_OPTIONS}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.optionItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    setEmploymentType(item.value);
                    setShowPicker(false);
                    if (errors.employmentType) setErrors({ ...errors, employmentType: "" });
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      employmentType === item.value ? { color: colors.primary } : null,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
