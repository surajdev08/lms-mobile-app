import { Stack } from "expo-router/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen
          name="taketest"
          options={{
            headerTitle: "Take Test",
          }}
        />
        <Stack.Screen
          name="testinstructions"
          options={{
            headerShown: true,
            headerTitle: "Instructions",
            headerBackTitle: "Go back",
            headerBackVisible: true,
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
