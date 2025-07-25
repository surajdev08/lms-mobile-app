import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider, useAuth } from "../context/AuthContext";

function AuthenticatedLayout() {
  const { user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] !== "(tabs)";
    if (user && inAuthGroup) {
      router.replace("/dashboard");
    }
  }, [user]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthenticatedLayout />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
