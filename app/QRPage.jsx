import {
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  Pressable,
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Text,
  IconButton,
  TextInput,
  Checkbox,
  Divider,
} from "react-native-paper";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import React from "react";
const RightContent = (props) => (
  <AntDesign {...props} name="customerservice" size={24} color="#006FFD" />
);
const QRPage = ({ navigation }) => {
  const [text, setText] = React.useState("");
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 20, color: "#006FFD" }}>LMS</Text>
          </View>
          <View>
            <RightContent />
          </View>
        </View>

        <View style={styles.action}>
          <Text
            style={{
              fontSize: 16,
              color: "black",

              cursor: "pointer",
            }}
          >
            Scan the QR Code
          </Text>
        </View>
        <View style={styles.cover}>
          <Image
            style={{ height: 200, width: 200 }}
            source={require("../assets/unnamed.png")}
          />
        </View>

        <Divider />

        <View style={styles.action}>
          <Text
            style={{
              fontSize: 16,
              color: "black",
              marginBottom: 20,

              cursor: "pointer",
            }}
          >
            Or
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "black",

              cursor: "pointer",
            }}
          >
            Enter Unique ID
          </Text>
        </View>

        <View style={styles.content}>
          <TextInput
            mode="outlined"
            label="Unique ID"
            value={text}
            onChangeText={(text) => setText(text)}
            selectionColor="white"
            outlineColor="#006FFD"
            activeOutlineColor="#006FFD"
          />
        </View>
        {/* <View style={styles.links}>

          <Text
            style={{
              fontSize: 16,
              color: "#006FFD",
              textDecorationLine: "underline",
              cursor: "pointer",
            }}
          >
            Forgot Password?
          </Text>
        </View> */}

        <View style={styles.action}>
          <Button
            style={{ backgroundColor: "#006FFD", width: "100%" }}
            mode="contained"
          >
            Enter
          </Button>
        </View>

        <View style={styles.action}>
          <Pressable onPress={() => navigation.navigate("Home")}>
            <Text
              style={{
                fontSize: 16,
                color: "#006FFD",
                textDecorationLine: "underline",
                cursor: "pointer",
              }}
            >
              Sign In Using Email?
            </Text>
          </Pressable>
        </View>
      </View>
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
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cover: {
    marginTop: 20,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    marginTop: 20,

    gap: 20,
  },

  action: {
    marginTop: 20,

    alignItems: "center",

    justifyContent: "center",
  },

  links: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default QRPage;
