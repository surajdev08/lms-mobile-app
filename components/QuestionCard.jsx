import React, { useState } from "react";
import {
  View,
  Image,
  Modal,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Text,
  RadioButton,
  Button,
  IconButton,
  Checkbox,
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
  questionType,
  testGuid,
  questionGuid,
  isMarkedForReview,
  onMarkForReviewChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Only "time up" if questionTime is a number (not null) AND runs to 0 or less
  const isTimeUp = typeof questionTime === "number" && questionTime <= 0;

  const cleanText = (text) =>
    decode(text ?? "")
      .replace(/<[^>]*>/g, "")
      .trim();

  const { bookmarkQuestion } = useTakeTestApi();
  const handleBookmark = () => {
    bookmarkQuestion(testGuid, questionGuid);
  };

  /** For mcmc: selectedOption is array, for mcsc: string or undefined/null */

  // --- RENDER CHOICES ---
  const renderChoices = () => {
    if (!Array.isArray(options) || !options.length) return null;

    if (questionType === "mcmc") {
      // Multiple answers, Checkbox
      const selected = Array.isArray(selectedOption) ? selectedOption : [];
      return options.map((choice) => {
        const checked = selected.includes(choice.choice_key);
        return (
          <TouchableOpacity
            key={choice.choice_key}
            onPress={() => {
              if (isTimeUp) return;
              // Toggle checkbox
              if (checked) {
                onSelectOption(selected.filter((k) => k !== choice.choice_key));
              } else {
                onSelectOption([...selected, choice.choice_key]);
              }
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              marginTop: 20,
              backgroundColor: checked ? "#e6f0ff" : "#fff",
              opacity: isTimeUp ? 0.5 : 1,
            }}
          >
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                if (isTimeUp) return;
                if (checked) {
                  onSelectOption(
                    selected.filter((k) => k !== choice.choice_key)
                  );
                } else {
                  onSelectOption([...selected, choice.choice_key]);
                }
              }}
              disabled={isTimeUp}
            />
            <Text style={{ flex: 1, marginLeft: 8 }}>
              {cleanText(choice.choice)}
            </Text>
          </TouchableOpacity>
        );
      });
    } else {
      // MCSC: single choice - "deselectable radio"
      return options.map((choice) => {
        const checked = selectedOption === choice.choice_key;
        return (
          <TouchableOpacity
            key={choice.choice_key}
            onPress={() => {
              if (isTimeUp) return;
              if (checked) {
                // Deselect if already selected
                onSelectOption(null);
              } else {
                onSelectOption(choice.choice_key);
              }
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              marginTop: 20,
              backgroundColor: checked ? "#e6f0ff" : "#fff",
              opacity: isTimeUp ? 0.5 : 1,
            }}
          >
            <RadioButton
              value={choice.choice_key}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                if (isTimeUp) return;
                if (checked) {
                  onSelectOption(null);
                } else {
                  onSelectOption(choice.choice_key);
                }
              }}
              disabled={isTimeUp}
            />
            <Text style={{ flex: 1, marginLeft: 8 }}>
              {cleanText(choice.choice)}
            </Text>
          </TouchableOpacity>
        );
      });
    }
  };

  const renderAttachment = (att, index) => {
    const type = att.file_type || "";
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
        <Card
          onPress={() => setModalVisible(true)}
          style={{ borderRadius: 12, marginBottom: 30 }}
        >
          <Card.Title
            title={
              questionTime == null
                ? "No Time Limit"
                : questionTime > 0
                ? `Time Left: ${questionTime}s`
                : "⏳ Time's Up!"
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
            {/* No overlay/freeze if questionTime is null */}
            {typeof questionTime === "number" && questionTime <= 0 && (
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
              />
            )}
          </Card.Content>
        </Card>

        {renderChoices()}

        {/* Mark for Review */}
        <TouchableOpacity
          onPress={() =>
            !isTimeUp &&
            onMarkForReviewChange &&
            onMarkForReviewChange(!isMarkedForReview)
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            marginTop: 20,
            backgroundColor: isMarkedForReview ? "#fff3cd" : "#fff",
            opacity: isTimeUp ? 0.5 : 1,
          }}
        >
          <Checkbox
            status={isMarkedForReview ? "checked" : "unchecked"}
            disabled={isTimeUp}
            onPress={() =>
              !isTimeUp &&
              onMarkForReviewChange &&
              onMarkForReviewChange(!isMarkedForReview)
            }
          />
          <Text style={{ flex: 1, marginLeft: 8 }}>Mark for Review</Text>
        </TouchableOpacity>

        {/* Modal for full details */}
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
