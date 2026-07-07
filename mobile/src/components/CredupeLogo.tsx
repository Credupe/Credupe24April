import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { useTheme } from "../theme/ThemeProvider";

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  layout?: "row" | "stacked";
}

export const CredupeLogo: React.FC<LogoProps> = ({
  size,
  withWordmark = true,
  layout = "row",
}) => {
  const { colors } = useTheme();

  const { width } = useWindowDimensions();

  const logoSize =
    size ||
    (width < 360
      ? 55
      : width < 480
      ? 70
      : 85);

  return (
    <View
      style={[
        styles.container,
        layout === "row"
          ? styles.row
          : styles.column,
      ]}
    >
      <Image
        source={require("../../assets/logo.png")}
        style={{
          width: logoSize,
          height: logoSize,
        }}
        resizeMode="contain"
      />

      {withWordmark && (
        <Text
          style={[
            layout === "row"
              ? styles.wordmarkRow
              : styles.wordmarkStacked,
            { color: colors.text },
          ]}
        >
          CreduPe
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  column: {
    flexDirection: "column",
    gap: 4,
  },

  wordmarkRow: {
    fontSize: 24,
    fontWeight: "800",
  },

  wordmarkStacked: {
    fontSize: 18,
    fontWeight: "700",
  },
});