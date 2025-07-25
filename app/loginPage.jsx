import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  Checkbox,
  IconButton,
} from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useLoginApi from "./hooks/useLoginApi";
import { useAuth } from "../context/AuthContext";
import { saveToken, saveGuid } from "../utils/secureStore";
import useSettingsApi from "./hooks/useSettingsApi";
const RightContent = () => (
  <AntDesign name="customerservice" size={24} color="#006FFD" />
);

const loginPage = () => {
  const { login, user } = useAuth();
  const { loginUser } = useLoginApi();
  const router = useRouter();
  const { resgistrationSettings, settings, loginSettings, signinSettings } =
    useSettingsApi();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState(null);
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [mobile, setMobile] = useState("");
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Email and Password are required.");
      return;
    }

    if (parseInt(userCaptchaInput) !== captchaAnswer) {
      Alert.alert("Invalid CAPTCHA", "Please solve the CAPTCHA correctly.");
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(email, password);
      if (response?.success) {
        await saveToken(response.access_token);
        await saveGuid(response.user.guid);
        login({ user: response.user, token: response.access_token });
        router.replace("/mytest");
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resgistrationSettings();
    signinSettings();
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("/mytest");
    }
  }, [user]);

  const handleRegisterPress = () => {
    if (settings?.disable_user_registration === 0) {
      router.push("/register");
    } else {
      Alert.alert("Registration Disabled", "Please contact support.");
    }
  };

  const handleloginotp = () => {
    router.push("/loginotp");
  };

  const handleForgotPasswordPress = () => {
    router.push("/forgotpassword");
  };

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    setCaptchaQuestion(`${a} + ${b}`);
    setCaptchaAnswer(a + b);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>LMS</Text>
            <RightContent />
          </View>

          {/* Image */}
          <View style={styles.coverContainer}>
            <Image
              style={styles.coverImage}
              source={require("../assets/login.png")}
            />
          </View>

          {/* Form */}
          <View style={styles.content}>
            {loginSettings?.login_field_email_show === 1 && (
              <TextInput
                label="Email"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                outlineColor="#006FFD"
                activeOutlineColor="#006FFD"
              />
            )}
            {loginSettings?.login_field_mobile_show === 1 && (
              <TextInput
                label="Mobile"
                mode="outlined"
                value={mobile}
                onChangeText={setMobile}
                autoCapitalize="none"
                outlineColor="#006FFD"
                activeOutlineColor="#006FFD"
              />
            )}
            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              outlineColor="#006FFD"
              activeOutlineColor="#006FFD"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <Pressable onPress={handleForgotPasswordPress}>
              <Text style={styles.linkText}>Forgot Password?</Text>
            </Pressable>
          </View>

          {/* Checkbox + Link */}
          <View style={styles.links}>
            <View style={{ marginTop: 10 }}>
              <Text variant="bodyLarge" style={{ marginBottom: 5 }}>
                {captchaQuestion} = ?
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                mode="outlined"
                value={userCaptchaInput}
                onChangeText={setUserCaptchaInput}
                keyboardType="numeric"
                outlineColor="#006FFD"
                activeOutlineColor="#006FFD"
                style={{ height: 10 }}
              />

              <IconButton icon="refresh" size={20} onPress={generateCaptcha} />
            </View>
          </View>
          {/* Action */}
          <View style={styles.action}>
            <Button
              mode="contained"
              style={styles.loginButton}
              loading={loading}
              onPress={handleLogin}
            >
              Sign In
            </Button>
          </View>

          {/* Register */}
          <View style={{ alignItems: "center", gap: 20 }}>
            <Pressable onPress={handleRegisterPress} style={styles.action}>
              <Text style={styles.linkText}>Register your Account?</Text>
            </Pressable>

            <Pressable onPress={handleloginotp}>
              <Text style={styles.linkText}>Login via OTP?</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    gap: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 22,
    color: "#006FFD",
  },
  coverContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  coverImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  content: {
    gap: 15,
  },
  links: {
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  linkText: {
    color: "#006FFD",
    textDecorationLine: "underline",
  },
  action: {
    marginTop: 10,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#006FFD",
    width: "100%",
  },
});

export default loginPage;
