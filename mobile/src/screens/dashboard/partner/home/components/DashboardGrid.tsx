import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { DashboardCard } from "./DashboardCard";
import { DashboardMenuItem } from "../data/dashboardMenu";

interface Props {
  data: DashboardMenuItem[];
  onCardPress: (item: DashboardMenuItem) => void;
}

export const DashboardGrid: React.FC<Props> = React.memo(({ data, onCardPress }) => {
  const renderItem = ({ item }: { item: DashboardMenuItem }) => {
    return (
      <DashboardCard
        title={item.title}
        description={item.description}
        iconName={item.iconName}
        onPress={() => onCardPress(item)}
      />
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      scrollEnabled={false} // Scrolling is handled by the parent ScrollView
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
