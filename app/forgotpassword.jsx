// import { View, Text, SafeAreaView } from "react-native";
// import React from "react";
// import { useRouter } from "expo-router";
// import { Button } from "react-native-paper";
// const changepassowrd = () => {
//   const router = useRouter();
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={{ flex: 1 }}>
//         <Text>Change Password</Text>
//         <Button onPress={() => router.back()}> Go back </Button>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default changepassowrd;

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Text, Button, TextInput, IconButton } from "react-native-paper";

import AntDesign from "@expo/vector-icons/AntDesign";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import useResetPasswordApi from "./hooks/useResetPasswordApi";

const RightContent = (props) => (
  <AntDesign {...props} name="customerservice" size={24} color="#006FFD" />
);

const forgotpassword = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("email");
  const [sendTrigger, setSendTrigger] = useState(false);

  const {
    status: emailStatus,
    response,
    error,
    validateEmail,
    validateOtp,
    changePassword,
  } = useResetPasswordApi(email, sendTrigger);

  const handleSendOtp = () => {
    // if (email.trim().toLowerCase() !== userData.email.toLowerCase()) {
    //   Alert.alert("Please enter a valid email");
    //   return;
    // }
    validateEmail(email);
  };

  useEffect(() => {
    if (emailStatus === "success" && response?.success) {
      setStatus("otp");
    } else if (emailStatus === "error") {
      alert("Email validation failed");
    }
  }, [emailStatus]);

  const verifyOtp = () => {
    validateOtp(email, otp);
  };

  useEffect(() => {
    if (emailStatus === "success" && response?.message === "OTP_VALIDATED") {
      setStatus("register");
    }
  }, [emailStatus, response?.message]);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    changePassword(email, password, confirmPassword);
  };

  useEffect(() => {
    if (emailStatus === "success" && response?.message === "PASSWORD_CHANGED") {
      setStatus("success");
    }
  }, [emailStatus, response?.message]);

  return (
    <SafeAreaView style={styles.container}>
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
          <Text>Change Password</Text>
          <Text>Help?</Text>
        </View>

        <View style={{ justifyContent: "center", flex: 1 }}>
          {status === "email" ? (
            <View style={styles.content}>
              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                outlineColor="#006FFD"
                activeOutlineColor="#006FFD"
                autoCapitalize="none"
              />
              <Button
                style={{ backgroundColor: "#006FFD", width: "100%" }}
                mode="contained"
                onPress={handleSendOtp}
                loading={emailStatus === "loading"}
              >
                Send OTP
              </Button>
            </View>
          ) : status === "otp" ? (
            <View style={styles.content}>
              <OtpInput numberOfDigits={6} value={otp} onTextChange={setOtp} />
              <Button
                style={{ backgroundColor: "#006FFD", width: "100%" }}
                mode="contained"
                onPress={verifyOtp}
              >
                Validate OTP
              </Button>
            </View>
          ) : status === "register" ? (
            <View style={styles.content}>
              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                outlineColor="#006FFD"
                activeOutlineColor="#006FFD"
              />
              <TextInput
                mode="outlined"
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                outlineColor="#006FFD"
                activeOutlineColor="#006FFD"
              />
              <Button
                style={{ backgroundColor: "#006FFD", width: "100%" }}
                mode="contained"
                onPress={handleRegister}
              >
                Reset
              </Button>
            </View>
          ) : (
            <View style={styles.headerText}>
              <Text style={{ fontSize: 20, color: "black" }}>
                Password Changed Successfully
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  card: {
    padding: 10,
    gap: 30,
    backgroundColor: "#ffffff",
    height: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coverContainer: {
    marginTop: 20,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },
  coverImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  headerText: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    marginTop: 10,
    gap: 20,
  },
  links: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default forgotpassword;
