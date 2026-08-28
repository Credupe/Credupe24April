import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { DIMENSIONS } from "../constants/dimensions";
import { COLORS } from "../constants/colors";
import { THEME } from "../constants/theme";
import { PaginationDots } from "./PaginationDots";
import { fetchPartnerProfile } from "../../../../../api/credupe";

interface SlideItem {
  title: string;
  subtitle: string;
  buttonText: string;
  route: string;
  imageUrl: string;
  gradientColors: [string, string, ...string[]];
}

const BANNER_SLIDES: SlideItem[] = [
  {
    title: "Complete Your KYC Verification",
    subtitle: "Submit documents to unlock all partner benefits and rewards.",
    buttonText: "Verify Now",
    route: "Kyc",
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80",
    gradientColors: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.65)"],
  },
  {
    title: "Instant Loan Processing",
    subtitle: "Fast approval with trusted lenders.",
    buttonText: "Apply Now",
    route: "ApplyPersonalLoan",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    gradientColors: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.65)"],
  },
  {
    title: "Grow Your Income",
    subtitle: "Track referrals and earnings easily.",
    buttonText: "Explore",
    route: "More",
    imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    gradientColors: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.65)"],
  },
];

interface Props {
  onPress?: (index: number) => void;
}

export const BannerCarousel: React.FC<Props> = React.memo(({ onPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<any>(null);
  const navigation = useNavigation<any>();

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeIndex + 1) % BANNER_SLIDES.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }
    }, 3000); // Auto scroll every 3 seconds as requested
  }, [activeIndex]);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [startAutoPlay, stopAutoPlay]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const width = event.nativeEvent.layoutMeasurement.width || DIMENSIONS.bannerWidth;
    if (width > 0) {
      const newIndex = Math.round(contentOffset / width);
      if (newIndex >= 0 && newIndex < BANNER_SLIDES.length) {
        setActiveIndex(newIndex);
      }
    }
  }, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: DIMENSIONS.bannerWidth,
    offset: DIMENSIONS.bannerWidth * index,
    index,
  }), []);

  const handleSlidePress = useCallback(async (item: SlideItem) => {
    try {
      if (item.route) {
        if (item.route === "Kyc") {
          try {
            const res = await fetchPartnerProfile();
            if (res.success && res.data?.profile?.onboardingStep === "COMPLETE") {
              navigation.navigate("PartnerKycStatus");
            } else {
              navigation.navigate("SignupSelection");
            }
          } catch {
            navigation.navigate("SignupSelection");
          }
        } else {
          navigation.navigate(item.route);
        }
      }
    } catch (e) {
      console.warn("Failed to navigate from banner slide:", e);
    }
  }, [navigation]);

  const renderItem = useCallback(({ item, index }: { item: SlideItem; index: number }) => {
    return (
      <Pressable
        onPress={() => handleSlidePress(item)}
        style={styles.slideContainer}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <LinearGradient
            colors={item.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>

              <View style={styles.buttonWrapper}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>{item.buttonText}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    );
  }, [handleSlidePress]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNER_SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={DIMENSIONS.bannerWidth}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        onScrollBeginDrag={stopAutoPlay}
        onScrollEndDrag={startAutoPlay}
        keyExtractor={(_, index) => index.toString()}
        style={styles.flatList}
      />
      <PaginationDots count={BANNER_SLIDES.length} activeIndex={activeIndex} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  flatList: {
    width: DIMENSIONS.bannerWidth,
    height: DIMENSIONS.bannerHeight,
    borderRadius: 24,
    ...THEME.shadow,
  },
  slideContainer: {
    width: DIMENSIONS.bannerWidth,
    height: DIMENSIONS.bannerHeight,
    borderRadius: 24,
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    borderRadius: 24,
  },
  gradientContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 16,
  },
  buttonWrapper: {
    alignSelf: "flex-start",
  },
  button: {
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
