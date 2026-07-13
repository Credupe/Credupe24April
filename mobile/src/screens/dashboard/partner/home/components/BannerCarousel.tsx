import React, { useEffect, useRef, useState, useCallback } from "react";
import { StyleSheet, View, Image, FlatList, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { DIMENSIONS } from "../constants/dimensions";
import { THEME } from "../constants/theme";
import { PaginationDots } from "./PaginationDots";

// Dynamically list assets based on the directory contents of assets/kyc_image.
// Because React Native / Metro require static paths for bundling,
// these are the required paths mapped to their dynamic indices.
const SLIDER_IMAGES = [
  require("../../../../../../assets/kyc_image/s1.png"),
  require("../../../../../../assets/kyc_image/s2.png"),
  require("../../../../../../assets/kyc_image/s3.png"),
];

interface Props {
  onPress?: (index: number) => void;
}

export const BannerCarousel: React.FC<Props> = React.memo(({ onPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<any>(null);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeIndex + 1) % SLIDER_IMAGES.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }
    }, 4000); // Auto scroll every 4 seconds
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
      if (newIndex >= 0 && newIndex < SLIDER_IMAGES.length) {
        setActiveIndex(newIndex);
      }
    }
  }, []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: DIMENSIONS.bannerWidth,
    offset: DIMENSIONS.bannerWidth * index,
    index,
  }), []);

  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <View style={styles.slideContainer}>
        <Image source={item} style={styles.image} resizeMode="cover" />
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDER_IMAGES}
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
      <PaginationDots count={SLIDER_IMAGES.length} activeIndex={activeIndex} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  flatList: {
    width: DIMENSIONS.bannerWidth,
    height: DIMENSIONS.bannerHeight,
    borderRadius: 16,
    ...THEME.shadow,
  },
  slideContainer: {
    width: DIMENSIONS.bannerWidth,
    height: DIMENSIONS.bannerHeight,
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});
