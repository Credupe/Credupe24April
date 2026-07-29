import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../constants/colors";

interface Props {
  count: number;
  activeIndex: number;
}

export const PaginationDots: React.FC<Props> = React.memo(({ count, activeIndex }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              isActive ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 6,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
  inactiveDot: {
    backgroundColor: "#D1D5DB",
    width: 6,
  },
});
