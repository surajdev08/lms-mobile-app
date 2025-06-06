import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Searchbar, Card, PaperProvider } from "react-native-paper";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import useBrowseTestApi from "../hooks/test/useBrowseTest";

const browsetest = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, browseData, fetchBrowseTests } = useBrowseTestApi();

  useEffect(() => {
    fetchBrowseTests(); // Initial load
  }, []);

  const onSearch = (query) => {
    setSearchQuery(query);
    fetchBrowseTests(query); // Refetch with search term
  };

  return (
    <PaperProvider settings={{ icon: (props) => <EvilIcons {...props} /> }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
        <View style={{ padding: 20 }}>
          <Searchbar
            placeholder="Search tests..."
            onChangeText={onSearch}
            value={searchQuery}
            style={styles.searchbar}
          />
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={{ padding: 20, color: "red" }}>{error}</Text>
        ) : (
          <FlatList
            data={browseData || []}
            keyExtractor={(item) => item.id?.toString()}
            contentContainerStyle={{ padding: 20, gap: 15 }}
            renderItem={({ item }) => (
              <Card style={styles.testCard}>
                <Card.Content>
                  <Text style={styles.testTitle}>{item.title}</Text>
                  <View style={styles.detailsRow}>
                    {/* <Text style={styles.detail}>Marks: {item.marks}</Text>
                    <Text style={styles.detail}>
                      Time: {item.duration} mins
                    </Text> */}
                  </View>
                </Card.Content>
              </Card>
            )}
          />
        )}
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
