import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Card, Button } from "react-native-paper";
import { Text, View, FlatList } from "react-native";
import TestCard from "../components/TestCard";
import { useRouter } from "expo-router";
const DATA = [
  {
    id: "1",
    title: "English",
    marks: "80/100",
    attempt: "23 August 2025",
  },
  {
    id: "2",
    title: "Maths",
    marks: "80/100",
    attempt: "23 August 2025",
  },
  {
    id: "3",
    title: "Science",
    marks: "80/100",
    attempt: "23 August 2025",
  },
  {
    id: "4",
    title: "React",
    marks: "80/100",
    attempt: "23 August 2025",
  },
  {
    id: "5",
    title: "React",
    marks: "80/100",
    attempt: "23 August 2025",
  },
  {
    id: "6",
    title: "React",
    marks: "80/100",
    attempt: "23 August 2025",
  },
  {
    id: "7",
    title: "React",
    marks: "80/100",
    attempt: "23 August 2025",
  },
  {
    id: "8",
    title: "React",
    marks: "80/100",
    attempt: "23 August 2025",
  },
];

function GradeCard({ title, attempt, marks }) {
  return (
    <Card style={{ height: 100, width: 180 }}>
      <Card.Title
        titleVariant="titleMedium"
        title={title}
        subtitle={attempt}
        subtitleVariant="bodyLarge"
      />
      <Card.Content>
        <Text style={{ fontWeight: 600, color: "blue" }}>{marks}</Text>
      </Card.Content>
    </Card>
  );
}

const GradeList = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ paddingHorizontal: 20, fontSize: 22, fontWeight: 600 }}>
        {" "}
        Grades
      </Text>
      <FlatList
        horizontal
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          gap: 15,
          paddingVertical: 20,
        }}
        showsHorizontalScrollIndicator={false}
        data={DATA}
        renderItem={({ item }) => <GradeCard {...item} />}
        keyExtractor={(item) => item.id}
      />
      <Button mode="text" onPress={() => router.push("/report")}>
        View All
      </Button>
    </View>
  );
};

export default GradeList;
