import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, IconButton, TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import useUserApi from "../hooks/user/useUserApi";
import DropDownPicker from "react-native-dropdown-picker";

const Accounts = () => {
  const router = useRouter();
  const { userData, fetchUserById, updateUser } = useUserApi();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryValue, setCountryValue] = useState(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState([
    { label: "Canada", value: "canada" },
    { label: "USA", value: "usa" },
    { label: "India", value: "india" },
    { label: "China", value: "china" },
    { label: "China", value: "china" },
    { label: "China", value: "china" },
  ]);

  useEffect(() => {
    setLoading(true);
    fetchUserById().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name || "");
      setLastName(userData.last_name || "");
      setEmail(userData.email || "");
      setMobile(userData.mobile || "");
      setCountryValue(userData.meta?.country || null);
    }
  }, [userData]);

  const handleSubmit = async () => {
    await updateUser({
      first_name,
      last_name,
      email,
      mobile,
      country: countryValue,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <IconButton
            icon="keyboard-backspace"
            size={20}
            onPress={() => router.back()}
          />
          <Text>My Account</Text>
          <Text>Help?</Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.title}>Update Profile</Text>

            <TextInput
              mode="outlined"
              label="First Name"
              value={first_name}
              onChangeText={setFirstName}
              outlineColor="#006FFD"
              activeOutlineColor="#006FFD"
              autoCapitalize="none"
            />
            <TextInput
              mode="outlined"
              label="Last Name"
              value={last_name}
              onChangeText={setLastName}
              outlineColor="#006FFD"
              activeOutlineColor="#006FFD"
              autoCapitalize="none"
            />
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              outlineColor="#006FFD"
              activeOutlineColor="#006FFD"
              autoCapitalize="none"
            />
            <TextInput
              mode="outlined"
              label="Contact Number"
              value={mobile}
              onChangeText={setMobile}
              outlineColor="#006FFD"
              activeOutlineColor="#006FFD"
            />

            <DropDownPicker
              open={open}
              value={countryValue}
              items={country}
              setOpen={setOpen}
              setValue={setCountryValue}
              setItems={setCountry}
              placeholder="Select your country"
              style={{ marginTop: 20 }}
              dropDownContainerStyle={{ zIndex: 1000 }}
              zIndex={1000}
              zIndexInverse={3000}
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={() => {
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setMobile("");
                  setCountryValue(null);
                }}
              >
                Reset
              </Button>
              <Button mode="contained" onPress={handleSubmit}>
                Save
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Accounts;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  container: {
    padding: 10,
    gap: 30,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    paddingBottom: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingTop: 30,
  },
});
