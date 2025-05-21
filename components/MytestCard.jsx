import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card } from "react-native-paper";

const Tab = createMaterialTopTabNavigator();

const dummyTests = {
  upcoming: [
    { id: "1", name: "Math Test", marks: 100, duration: "60 min" },
    { id: "2", name: "Science Quiz", marks: 50, duration: "30 min" },
    { id: "3", name: "History Exam", marks: 75, duration: "45 min" },
  ],
  ongoing: [
    { id: "5", name: "Physics Test", marks: 100, duration: "90 min" },
    { id: "6", name: "Chemistry Quiz", marks: 50, duration: "40 min" },
    { id: "7", name: "Biology Exam", marks: 75, duration: "55 min" },
  ],
  previous: [
    { id: "9", name: "Computer Science", marks: 100, duration: "75 min" },
    { id: "10", name: "Economics Quiz", marks: 50, duration: "35 min" },
    { id: "11", name: "Psychology Test", marks: 75, duration: "50 min" },
  ],
};

export default function MyTestCard() {
  const router = useRouter();
  return (
    <View style={{ width: "100%", padding: 20, height: 600 }}>
      <Tab.Navigator>
        <Tab.Screen name="Upcoming" component={Upcoming} />
        <Tab.Screen name="Ongoing" component={Ongoing} />
        <Tab.Screen name="Previous" component={Previous} />
      </Tab.Navigator>
      <Button mode="text" onPress={() => router.push("/mytest")}>
        View More
      </Button>
    </View>
  );
}

function TestCards({ tests }) {
  const router = useRouter();
  return (
    <View style={{ gap: 10 }}>
      {tests.map((test) => (
        <Card key={test.id} style={{ marginBottom: 10 }}>
          <Card.Title
            titleVariant="titleMedium"
            title={test.name}
            subtitle={`${test.marks} marks • ${test.duration}`}
            subtitleVariant="bodyLarge"
          />
          <Card.Content>
            <Button
              mode="outlined"
              onPress={() => router.push(`/mytest/${test.id}`)}
              style={{ width: 150 }}
            >
              View Test
            </Button>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

function Upcoming() {
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
      <TestCards tests={dummyTests.upcoming} />
    </View>
  );
}

function Ongoing() {
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
      <TestCards tests={dummyTests.ongoing} />
    </View>
  );
}

function Previous() {
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "white" }}>
      <TestCards tests={dummyTests.previous} />
    </View>
  );
}
