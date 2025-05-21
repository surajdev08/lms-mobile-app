import { View, Text, SafeAreaView, StyleSheet, FlatList } from "react-native";
import React, { useState } from "react";
import { Searchbar, Card, List, PaperProvider } from "react-native-paper";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const mockTests = [
  {
    id: "1",
    title: "New PHP",
    marks: "100",
    time: "45 mins",
  },
  {
    id: "2",
    title: "DEMO",
    marks: "80",
    time: "30 mins",
  },
  {
    id: "3",
    title: "English",
    marks: "100",
    time: "60 mins",
  },
  {
    id: "4",
    title: "Science ",
    marks: "90",
    time: "50 mins",
  },
  {
    id: "4",
    title: "React",
    marks: "90",
    time: "50 mins",
  },
  {
    id: "4",
    title: "Python ",
    marks: "90",
    time: "50 mins",
  },
];

const browsetest = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTests = mockTests.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PaperProvider
      settings={{
        icon: (props) => <EvilIcons {...props} />,
      }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        <View style={{ padding: 20 }}>
          <Searchbar
            placeholder="Search tests..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>

        <FlatList
          data={filteredTests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, gap: 15 }}
          renderItem={({ item }) => (
            <Card style={styles.testCard}>
              <Card.Content>
                <Text style={styles.testTitle}>{item.title}</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detail}>Marks: {item.marks}</Text>
                  <Text style={styles.detail}>Time: {item.time}</Text>
                </View>
              </Card.Content>
            </Card>
          )}
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

export default browsetest;

const styles = StyleSheet.create({
  searchbar: {
    borderRadius: 10,
  },
  testCard: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
});
