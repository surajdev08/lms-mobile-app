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
import useLoginApi from "./hooks/useLoginApi";
import useSettingsApi from "./hooks/useSettingsApi";

import { saveToken, saveGuid } from "../utils/secureStore";
const RightContent = (props) => (
  <AntDesign {...props} name="customerservice" size={24} color="#006FFD" />
);

const loginotp = () => {
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
  const { loginSettings, settings, signinSettings } = useSettingsApi();
  const { login, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    status: emailStatus,
    response,
    error,
    validateEmail,
    validateOtp,
    registerUser,
    validateMobile,
    loginviaotp,
  } = useLoginApi();
  const handleSendOtp = () => {
    if (loginSettings?.login_field_mobile_show === 1 && mobile) {
      validateEmail(mobile);
      return;
    }
    if (loginSettings?.login_field_email_show === 1 && email) {
      validateEmail(email);
      return;
    }
  };

  useEffect(() => {
    signinSettings();
  }, []);

  useEffect(() => {
    if (emailStatus === "success" && response?.success) {
      setStatus("otp");
    } else if (emailStatus === "error") {
      alert("Email validation failed");
    }
  }, [emailStatus]);

  useEffect(() => {
    if (mobile_otp.length === 6 || email_otp.length === 6) {
      validateOtp(email, email_otp, mobile, mobile_otp);
    }
  }, [mobile_otp, email_otp]);

  useEffect(() => {
    if (email_otp.length === 6 && mobile_otp.length === 6) {
      validateOtp(email, email_otp, mobile, mobile_otp);
    }
  }, [email_otp, mobile_otp]);

  const handlelogin = async () => {
    setLoading(true);
    try {
      const response = await loginviaotp(email, mobile);
      if (response?.success) {
        await saveToken(response.access_token);
        await saveGuid(response.user.guid);
        login({ user: response.user, token: response.access_token });
        router.replace("/dashboard");
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
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
            <Text style={{ fontSize: 20, color: "black" }}>Login via OTP</Text>
          </View>

          {status === "email" ? (
            <View style={styles.content}>
              {loginSettings?.login_field_email_show === 1 && (
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

              {loginSettings?.login_field_mobile_show === 1 && (
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
              {loginSettings?.login_field_email_show === 1 && (
                <>
                  <Text>Email OTP</Text>
                  <OtpInput
                    numberOfDigits={6}
                    value={email_otp}
                    onTextChange={setEmailOtp}
                  />
                </>
              )}

              {loginSettings?.login_field_mobile_show === 1 && (
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
                onPress={handlelogin}
                loading={loading}
                disabled={loading}
              >
                Login
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
                Login with password instead?
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

export default loginotp;
