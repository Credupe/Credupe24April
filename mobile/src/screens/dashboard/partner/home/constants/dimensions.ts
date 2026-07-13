import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const bannerWidth = Math.min(width - 32, 480);

export const DIMENSIONS = {
  width,
  height,
  cardWidth: (width - 48) / 3, // Grid card width
  bannerWidth,
  bannerHeight: Math.round(bannerWidth * 0.26), // Maintain a clean ~3.85:1 aspect ratio matching the banner images
};
