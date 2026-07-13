import React from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { DashboardCard } from "./DashboardCard";
import { DashboardMenuItem } from "../data/dashboardMenu";

interface Props {
  data: DashboardMenuItem[];
  onCardPress: (item: DashboardMenuItem) => void;
}

export const DashboardGrid: React.FC<Props> = React.memo(({ data, onCardPress }) => {
  // Pad data array to a multiple of 3 to align last items nicely
  const paddedData = [...data];
  while (paddedData.length % 3 !== 0) {
    paddedData.push({
      id: `dummy-${paddedData.length}`,
      title: "",
      icon: "",
      iconType: "MaterialCommunityIcons",
      route: "",
    });
  }

  const renderItem = ({ item }: { item: DashboardMenuItem }) => {
    if (item.id.startsWith("dummy")) {
      return <View style={styles.dummyCard} />;
    }
    return (
      <DashboardCard
        title={item.title}
        iconName={item.icon}
        iconType={item.iconType}
        onPress={() => onCardPress(item)}
      />
    );
  };

  return (
    <FlatList
      data={paddedData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      scrollEnabled={false} // Scrolling is handled by the parent ScrollView
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dummyCard: {
    width: "32%",
    aspectRatio: 0.88,
    padding: 4,
    backgroundColor: "transparent",
  },
});
