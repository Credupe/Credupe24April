import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// 20px horizontal padding on each side -> total screen padding is 40
const bannerWidth = Math.min(width - 40, 480);

export const DIMENSIONS = {
  width,
  height,
  cardWidth: (width - 60) / 2, // 2 columns: screen width - 40 (horizontal padding) - 20 (middle gap)
  bannerWidth,
  bannerHeight: 180,           // Standardized banner height 180
};
