import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  PaperProvider,
  List,
  ActivityIndicator,
} from "react-native-paper";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import useUserApi from "../hooks/user/useUserApi";
import { useAuth } from "../../context/AuthContext";

const Manage = () => {
  const { userData, fetchUserById, updateProfileimg } = useUserApi();
  const { logout } = useAuth();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [profileUri, setProfileUri] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUserById();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/loginPage");
  };

  const pickAndUploadProfile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Please allow gallery access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const image = result.assets?.[0];
    if (!image) return;

    const localUri = image.uri;
    const filename = localUri.split("/").pop();
    const extMatch = /\.(\w+)$/.exec(filename ?? "");
    const mimeType = extMatch ? `image/${extMatch[1]}` : "image";

    const imageFile = {
      uri: localUri,
      name: filename,
      type: mimeType,
    };

    setUploading(true);
    setMessage("");

    const res = await updateProfileimg(imageFile);
    setUploading(false);

    if (res?.success) {
      setProfileUri(localUri);
      setMessage("Profile picture updated successfully!");
      fetchUserById();
    } else if (res?.message?.profile_image) {
      const errorMsg = Array.isArray(res.message.profile_image)
        ? res.message.profile_image.join(" ")
        : res.message.profile_image;
      setMessage(errorMsg);
      Alert.alert("Upload Failed", errorMsg);
    } else if (res?.message) {
      setMessage(res.message);
      Alert.alert("Upload Failed", res.message);
    } else {
      setMessage("Upload failed. Please try again.");
      Alert.alert("Upload Failed", "Please try again.");
    }
  };

  const resetProfileImage = () => {
    setProfileUri(null);
    setMessage("");
  };

  const name = `${userData?.first_name || ""} ${
    userData?.last_name || ""
  }`.trim();

  return (
    <PaperProvider
      settings={{
        icon: (props) => <EvilIcons {...props} />,
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Card style={styles.profileCard}>
              <View style={styles.profileImgContainer}>
                {uploading ? (
                  <ActivityIndicator size={60} style={{ margin: 10 }} />
                ) : (
                  <Avatar.Image
                    size={80}
                    source={
                      profileUri
                        ? { uri: profileUri }
                        : userData?.profile_image
                        ? { uri: userData.profile_image }
                        : require("../../assets/avatar.jpg")
                    }
                    style={styles.avatar}
                  />
                )}
                <Text style={styles.userName}>{name}</Text>
              </View>

              <View style={styles.profileDetails}>
                <View style={styles.chipContainer}>
                  <Chip onPress={() => {}}>Student</Chip>
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={pickAndUploadProfile}
                    loading={uploading}
                    disabled={uploading}
                  >
                    Upload Profile
                  </Button>
                  <Button
                    mode="outlined"
                    textColor="red"
                    style={styles.resetButton}
                    onPress={resetProfileImage}
                    disabled={uploading}
                  >
                    Reset
                  </Button>
                </View>

                {message ? (
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color: message.includes("successfully")
                          ? "green"
                          : "red",
                      },
                    ]}
                  >
                    {message}
                  </Text>
                ) : null}
              </View>
            </Card>

            <View style={styles.listContainer}>
              <List.Item
                title="Account"
                description="Manage Account Details"
                style={styles.listItem}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
                onPress={() => router.push("/accounts")}
              />
              <List.Item
                title="Change Password"
                description="Check and manage passwords"
                style={styles.listItem}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
                onPress={() => router.push("/changepassword")}
              />
              <List.Item
                title="Billings and Plans"
                description="Manage Your billing plans"
                style={styles.listItem}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
              />
              <List.Item
                title="Notifications"
                description="Manage your notifications"
                style={styles.listItem}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
              />
              <List.Item
                title="Sign Out"
                style={styles.listItem}
                titleStyle={styles.signOutText}
                right={(props) => <List.Icon {...props} icon="arrow-right" />}
                onPress={handleLogout}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    justifyContent: "center",
    height: "45%",
    alignItems: "center",
    padding: 20,
  },
  profileImgContainer: {
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    backgroundColor: "#f1f1f1",
  },
  userName: {
    fontWeight: "600",
    fontSize: 18,
  },
  profileDetails: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
  },
  chipContainer: {
    justifyContent: "center",
    gap: 10,
    flexDirection: "row",
    paddingTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  resetButton: {
    borderColor: "red",
    width: 120,
  },
  messageText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
  listContainer: {
    paddingVertical: 20,
    gap: 10,
  },
  listItem: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    backgroundColor: "white",
    borderRadius: 10,
  },
  signOutText: {
    color: "red",
  },
});

export default Manage;
