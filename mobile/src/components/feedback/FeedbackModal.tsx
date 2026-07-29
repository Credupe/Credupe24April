import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Animated,
  Pressable,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";
import { EmojiRating } from "./EmojiRating";
import { GradientButton } from "./GradientButton";

interface FeedbackModalProps {
  visible: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

const FONT_FAMILY = Platform.select({
  ios: "SF Pro Display",
  android: "sans-serif-medium",
  default: "System",
});

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  loading,
  onClose,
  onSubmit,
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [renderModal, setRenderModal] = useState(visible);

  // Animation values
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setRenderModal(true);
      // Trigger entrance animations
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          tension: 45,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Trigger exit animations before unmounting/hiding
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderModal(false);
      });
    }
  }, [visible]);

  const handleClose = () => {
    if (loading) return; // Prevent closing while loading
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRenderModal(false);
      onClose();
    });
  };

  const handleSubmit = () => {
    if (selectedRating !== null && !loading) {
      onSubmit(selectedRating);
    }
  };

  if (!renderModal) return null;

  return (
    <Modal
      transparent
      visible={renderModal}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Animated dim backdrop */}
        <Animated.View
          style={[styles.backdrop, { opacity: overlayOpacity }]}
        />

        {/* Modal content wrap */}
        <View style={styles.contentWrap}>
          {/* Card body */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: cardOpacity,
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            <Text style={styles.title}>How's your experience so far?</Text>
            <Text style={styles.subtitle}>We would love to know</Text>

            <View style={styles.ratingContainer}>
              <EmojiRating
                selectedRating={selectedRating}
                onSelectRating={setSelectedRating}
              />
            </View>

            <GradientButton
              title="Submit"
              onPress={handleSubmit}
              disabled={selectedRating === null}
              loading={loading}
            />
          </Animated.View>

          {/* Floating close button at the bottom of the card */}
          <Animated.View style={[styles.closeButtonWrap, { opacity: cardOpacity }]}>
            <Pressable
              onPress={handleClose}
              disabled={loading}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
            >
              <X size={24} color="#111827" />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15, 23, 42, 0.7)", // Premium dark blue-gray backdrop
  },
  contentWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FCFBFF", // Subtle high-end background
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A", // Sleek dark slate
    textAlign: "center",
    fontFamily: FONT_FAMILY,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 15,
    color: "#475569", // Cool gray
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    fontFamily: FONT_FAMILY,
    fontWeight: "500",
  },
  ratingContainer: {
    width: "100%",
    marginVertical: 12,
  },
  closeButtonWrap: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  closeButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});
