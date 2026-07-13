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
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  inactiveDot: {
    backgroundColor: COLORS.primaryMuted,
    opacity: 0.5,
  },
});
