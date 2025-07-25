import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";

const options = [1, 2, 3, 4, 5];

function RadioGroup({ value, onChange, name }) {
  return (
    <View style={styles.radioRow}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[
            styles.radioCircle,
            value === opt && styles.radioCircleSelected,
          ]}
          onPress={() => onChange(opt)}
          accessibilityLabel={`Rating ${opt} for ${name}`}
        >
          {value === opt && <View style={styles.radioDot} />}
          <Text style={styles.radioLabel}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const FeedbackFormScreen = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    environment: null,
    instructions: null,
    prepared: null,
    issues: null,
    issuesDesc: "",
    processIdeal: null,
    monitoring: null,
    comfortable: null,
    stress: null,
    satisfaction: null,
    otherIssues: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    // Submit form via API here...
    setTimeout(() => {
      setSubmitting(false);
      router.replace("/(tabs)/dashboard"); // or show a thank-you screen
    }, 1000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.header}>Feedback Form</Text>

        <Text style={styles.question}>
          1. Are you satisfied with the overall environment of Online
          Examination?
        </Text>
        <RadioGroup
          value={form.environment}
          onChange={(v) => setForm((f) => ({ ...f, environment: v }))}
          name="environment"
        />

        <Text style={styles.question}>
          2. Are you satisfied with the instructions given by the Exam team?
        </Text>
        <RadioGroup
          value={form.instructions}
          onChange={(v) => setForm((f) => ({ ...f, instructions: v }))}
          name="instructions"
        />

        <Text style={styles.question}>
          3. I was adequately prepared to participate in this Online exam?
        </Text>
        <RadioGroup
          value={form.prepared}
          onChange={(v) => setForm((f) => ({ ...f, prepared: v }))}
          name="prepared"
        />

        <Text style={styles.question}>
          4. Did you face any technical issues in the exam?
        </Text>
        <View style={styles.radioRow}>
          <TouchableOpacity
            style={styles.radioCircle}
            onPress={() => setForm((f) => ({ ...f, issues: true }))}
          >
            {form.issues === true && <View style={styles.radioDot} />}
            <Text style={styles.radioLabel}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.radioCircle}
            onPress={() => setForm((f) => ({ ...f, issues: false }))}
          >
            {form.issues === false && <View style={styles.radioDot} />}
            <Text style={styles.radioLabel}>No</Text>
          </TouchableOpacity>
        </View>
        {form.issues === true && (
          <TextInput
            placeholder="If yes, please specify"
            multiline
            value={form.issuesDesc}
            style={styles.textInput}
            onChangeText={(text) =>
              setForm((f) => ({ ...f, issuesDesc: text }))
            }
          />
        )}

        <Text style={styles.question}>
          5. The process of this Online examination was ideal for conducting
          this nature of Exam.
        </Text>
        <RadioGroup
          value={form.processIdeal}
          onChange={(v) => setForm((f) => ({ ...f, processIdeal: v }))}
          name="processIdeal"
        />

        <Text style={styles.question}>
          6. This Online exam is very effective in monitoring student
          activities?
        </Text>
        <RadioGroup
          value={form.monitoring}
          onChange={(v) => setForm((f) => ({ ...f, monitoring: v }))}
          name="monitoring"
        />

        <Text style={styles.question}>
          7. I was very comfortable in handling the technology and device during
          this examination.
        </Text>
        <RadioGroup
          value={form.comfortable}
          onChange={(v) => setForm((f) => ({ ...f, comfortable: v }))}
          name="comfortable"
        />

        <Text style={styles.question}>
          8. Participation in this online exam was very stressful.
        </Text>
        <RadioGroup
          value={form.stress}
          onChange={(v) => setForm((f) => ({ ...f, stress: v }))}
          name="stress"
        />

        <Text style={styles.question}>
          9. I am very satisfied with this Online examination process.
        </Text>
        <RadioGroup
          value={form.satisfaction}
          onChange={(v) => setForm((f) => ({ ...f, satisfaction: v }))}
          name="satisfaction"
        />

        <Text style={styles.question}>10. Other Issues, If any</Text>
        <TextInput
          placeholder="Your feedback"
          style={styles.textInput}
          value={form.otherIssues}
          multiline
          onChangeText={(text) => setForm((f) => ({ ...f, otherIssues: text }))}
        />

        <Button
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
        >
          Submit Feedback
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#2156F5",
  },
  question: {
    marginTop: 18,
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 15,
    color: "#25245A",
  },
  radioRow: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  radioCircle: {
    borderWidth: 2,
    borderColor: "#2156F5",
    borderRadius: 22,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    backgroundColor: "#F0F4FA",
  },
  radioCircleSelected: {
    borderColor: "#2156F5",
    backgroundColor: "#e9f0ff",
  },
  radioLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2156F5",
    marginTop: 3,
  },
  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 8,
    backgroundColor: "#2156F5",
    marginBottom: 1,
  },
  textInput: {
    backgroundColor: "#F7F8FA",
    borderColor: "#D9DBE9",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 40,
    marginVertical: 8,
    color: "#25245A",
    fontSize: 15,
  },
  submitButton: {
    marginTop: 28,
    borderRadius: 8,
    paddingVertical: 6,
    backgroundColor: "#2156F5",
  },
});

export default FeedbackFormScreen;
