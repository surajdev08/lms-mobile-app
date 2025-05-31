import React, { useState, useEffect } from "react";
import { View, Image, Modal, ScrollView, SafeAreaView } from "react-native";
import {
  Card,
  Text,
  RadioButton,
  Button,
  IconButton,
} from "react-native-paper";
import { decode } from "he";
import { Video } from "expo-av";
import useTakeTestApi from "../app/hooks/test/useTakeTestApi";

const QuestionCard = ({
  currentQuestionIndex,
  questionText,
  options,
  attachments = [],
  selectedOption,
  onSelectOption,
  questionTime,
  testGuid,
  questionGuid,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const isTimeUp = questionTime <= 0;

  const decodeHtmlEntities = (text) => decode(text);
  const stripHtmlTags = (html) => html.replace(/<[^>]*>/g, "").trim();
  const cleanText = (text) => stripHtmlTags(text);

  const { bookmarkQuestion } = useTakeTestApi();
  const handleBookmark = () => {
    bookmarkQuestion(testGuid, questionGuid);
  };

  const renderAttachment = (att, index) => {
    const type = att.file_type;

    if (type.startsWith("image")) {
      return (
        <Image
          key={index}
          source={{ uri: att.file_path }}
          style={{ width: "100%", height: 200, borderRadius: 8, marginTop: 8 }}
          resizeMode="contain"
        />
      );
    } else if (type.startsWith("video")) {
      return (
        <Video
          key={index}
          source={{ uri: att.file_path }}
          style={{ width: "100%", height: 200, marginTop: 8 }}
          useNativeControls
          resizeMode="contain"
        />
      );
    } else if (type.startsWith("audio")) {
      return (
        <View key={index} style={{ marginTop: 8 }}>
          <Video
            source={{ uri: att.file_path }}
            useNativeControls
            style={{ width: "100%", height: 50 }}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={{ flex: 1, marginBottom: 100 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        {/* Question Card */}
        <Card
          onPress={() => setModalVisible(true)}
          style={{ borderRadius: 12, marginBottom: 30 }}
        >
          <Card.Title
            title={
              questionTime > 0 ? `Time Left: ${questionTime}s` : "⏳ Time's Up!"
            }
            right={(props) => (
              <IconButton
                {...props}
                icon="bookmark-outline"
                onPress={handleBookmark}
              />
            )}
          />
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              {cleanText(questionText)}
            </Text>

            {attachments?.map((att, index) => (
              <View key={index} style={{ marginTop: 10 }}>
                {renderAttachment(att, index)}
              </View>
            ))}

            {isTimeUp && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255,255,255,0.8)",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                  zIndex: 10,
                }}
              ></View>
            )}
          </Card.Content>
        </Card>

        {/* Options */}
        <RadioButton.Group
          onValueChange={isTimeUp ? () => {} : onSelectOption}
          value={selectedOption}
        >
          {options?.map((choice) => (
            <View
              key={choice.id || choice.choice_key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 12,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                marginTop: 20,
                backgroundColor:
                  selectedOption === choice.choice_key ? "#e6f0ff" : "#fff",
                opacity: isTimeUp ? 0.5 : 1,
              }}
            >
              <RadioButton value={choice.choice_key} disabled={isTimeUp} />
              <Text style={{ flex: 1 }}>{cleanText(choice.choice)}</Text>

              {choice.attachments?.map((att, idx) => (
                <Image
                  key={idx}
                  source={{ uri: att.url }}
                  style={{
                    width: 80,
                    height: 80,
                    marginLeft: 8,
                    borderRadius: 8,
                  }}
                  resizeMode="contain"
                />
              ))}
            </View>
          ))}
        </RadioButton.Group>

        {/* Mark for Review */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            marginTop: 20,
            backgroundColor: "#fff",
            opacity: isTimeUp ? 0.5 : 1,
          }}
        >
          <RadioButton disabled={isTimeUp} />
          <Text style={{ flex: 1 }}>Mark for Review</Text>
        </View>

        {/* Leave Unattended */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            marginTop: 20,
            backgroundColor: "#fff",
            opacity: isTimeUp ? 0.5 : 1,
          }}
        >
          <RadioButton disabled={isTimeUp} />
          <Text style={{ flex: 1 }}>Leave Unattended</Text>
        </View>

        {/* Scrollable Modal for Full Question View */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Card style={{ borderRadius: 12 }}>
                <Card.Content>
                  <Text variant="titleLarge" style={{ marginBottom: 8 }}>
                    {cleanText(questionText)}
                  </Text>

                  {attachments?.map((att, index) => (
                    <View key={index} style={{ marginTop: 10 }}>
                      {renderAttachment(att, index)}
                    </View>
                  ))}
                </Card.Content>
              </Card>

              <Button
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={{ marginTop: 20 }}
              >
                Close
              </Button>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default QuestionCard;
