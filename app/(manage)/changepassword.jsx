import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
const changepassowrd = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text>Change Password</Text>
        <Button onPress={() => router.back()}> Go back </Button>
      </View>
    </SafeAreaView>
  );
};

export default changepassowrd;
