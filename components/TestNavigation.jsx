import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const TestNavigation = ({
  handleNext,
  handlePrevious,
  handleSubmit,
  disablePrevious,
  disableNext,
  lastquestion = false,
  isSubmitting = false,
}) => {
  return (
    <View style={styles.footer}>
      {!lastquestion ? (
        <>
          <Button
            mode="outlined"
            onPress={handlePrevious}
            disabled={disablePrevious}
            style={styles.button}
          >
            Previous
          </Button>

          <Button
            mode="contained"
            onPress={handleNext}
            disabled={disableNext}
            style={styles.button}
          >
            Next
          </Button>
        </>
      ) : (
        <>
          <Button
            mode="outlined"
            onPress={handlePrevious}
            disabled={disablePrevious}
            style={styles.button}
          >
            Previous
          </Button>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    paddingHorizontal: 20,
    height: 76,
  },
  button: {
    flex: 0.45,
  },
});

export default TestNavigation;
