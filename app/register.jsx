import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import useRegisterApi from "./hooks/useRegisterApi";
import useSettingsApi from "./hooks/useSettingsApi";
const RightContent = (props) => (
  <AntDesign {...props} name="customerservice" size={24} color="#006FFD" />
);

const Register = () => {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [email_otp, setEmailOtp] = useState("");
  const [mobile_otp, setMobileOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("email");
  const [sendTrigger, setSendTrigger] = useState(false);
  const { resgistrationSettings, settings } = useSettingsApi();
  const {
    status: emailStatus,
    response,
    error,
    validateEmail,
    validateOtp,
    registerUser,
    validateMobile,
  } = useRegisterApi(email, sendTrigger);

  const handleSendOtp = () => {
    if (settings?.required_field_email === "1" && !email) {
      alert("Email is required");
      return;
    }
    if (settings?.required_field_mobile === "1" && !mobile) {
      alert("Mobile number is required");
      return;
    }
    validateEmail(email);
    validateMobile(mobile);
  };

  useEffect(() => {
    resgistrationSettings();
  }, []);

  useEffect(() => {
    if (emailStatus === "success" && response?.success) {
      setStatus("otp");
    } else if (emailStatus === "error") {
      alert("Email validation failed");
    }
  }, [emailStatus]);

  const verifyOtp = () => {
    if (settings?.required_field_email === "1" && !email_otp) {
      alert("Enter email OTP");
      return;
    }
    if (settings?.required_field_mobile === "1" && !mobile_otp) {
      alert("Enter mobile OTP");
      return;
    }

    validateOtp(email, email_otp, mobile, mobile_otp);
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

    registerUser(firstName, lastName, password, confirmPassword, email, mobile);
  };

  useEffect(() => {
    if (emailStatus === "success" && response?.message === "USER_REGISTERED") {
      setStatus("success");
    }
  }, [emailStatus, response?.message]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={{ fontSize: 20, color: "#006FFD" }}>LMS</Text>
            <RightContent />
          </View>

          <View style={styles.coverContainer}>
            <Image
              style={styles.coverImage}
              source={require("../assets/login.png")}
            />
          </View>

          <View style={styles.headerText}>
            <Text style={{ fontSize: 20, color: "black" }}>
              Register Your Account
            </Text>
          </View>

          {status === "email" ? (
            <View style={styles.content}>
              {settings?.registration_field_email_show === "1" && (
                <TextInput
                  mode="outlined"
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  outlineColor="#006FFD"
                  activeOutlineColor="#006FFD"
                  autoCapitalize="none"
                />
              )}

              {settings?.registration_field_mobile_show === "1" && (
                <TextInput
                  mode="outlined"
                  label="Mobile"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  outlineColor="#006FFD"
                  activeOutlineColor="#006FFD"
                />
              )}

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
              {settings?.registration_field_email_show === "1" && (
                <>
                  <Text>Email OTP</Text>
                  <OtpInput
                    numberOfDigits={6}
                    value={email_otp}
                    onTextChange={setEmailOtp}
                  />
                </>
              )}

              {settings?.registration_field_mobile_show === "1" && (
                <>
                  <Text>Mobile OTP</Text>
                  <OtpInput
                    numberOfDigits={6}
                    value={mobile_otp}
                    onTextChange={setMobileOtp}
                  />
                </>
              )}

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
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                outlineColor="#006FFD"
                activeOutlineColor="#006FFD"
              />
              <TextInput
                mode="outlined"
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                outlineColor="#006FFD"
                activeOutlineColor="#006FFD"
              />
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
                Register
              </Button>
            </View>
          ) : (
            <View style={styles.headerText}>
              <Text style={{ fontSize: 20, color: "black" }}>
                Account Created Successfully
              </Text>

              <Pressable style={styles.links} onPress={() => router.back()}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#006FFD",
                    textDecorationLine: "underline",
                    paddingTop: 10,
                  }}
                >
                  Click here to Sign In
                </Text>
              </Pressable>
            </View>
          )}

          {status !== "success" && (
            <Pressable style={styles.links} onPress={() => router.back()}>
              <Text
                style={{
                  fontSize: 16,
                  color: "#006FFD",
                  textDecorationLine: "underline",
                }}
              >
                Sign In Instead?
              </Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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

export default Register;
