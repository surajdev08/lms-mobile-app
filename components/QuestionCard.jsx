import React, { useState } from "react";
import { View, Image, Modal, ScrollView, SafeAreaView } from "react-native";
import { Card, Text, RadioButton, Button, TextInput } from "react-native-paper";
import { decode } from "he";

const QuestionCard = ({
  currentQuestionIndex,
  questionText,
  options,
  attachments = [],
  selectedOption,
  onSelectOption,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const decodeHtmlEntities = (text) => decode(text);

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, "").trim();
  };
  const cleanText = (text) => stripHtmlTags(text);
  return (
    <ScrollView style={{ flex: 1, marginBottom: 100 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
        {/* Question Card */}
        <Card
          onPress={() => setModalVisible(true)}
          style={{ borderRadius: 12, marginBottom: 30 }}
        >
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 8 }}>
              {cleanText(questionText)}
            </Text>

            {/* Question Attachments */}
            {attachments?.map((att, index) => (
              <Image
                key={index}
                source={{ uri: att.url }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 8,
                  marginTop: 8,
                }}
                resizeMode="contain"
              />
            ))}
          </Card.Content>
        </Card>

        {/* Options */}
        <RadioButton.Group
          onValueChange={onSelectOption}
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
              }}
            >
              <RadioButton value={choice.choice_key} />
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
          }}
        >
          <RadioButton />
          <Text style={{ flex: 1 }}>Mark for Review</Text>
        </View>

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
          }}
        >
          <RadioButton />
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
                    <Image
                      key={index}
                      source={{ uri: att.url }}
                      style={{
                        width: "100%",
                        height: 300,
                        marginTop: 10,
                        borderRadius: 8,
                      }}
                      resizeMode="contain"
                    />
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
