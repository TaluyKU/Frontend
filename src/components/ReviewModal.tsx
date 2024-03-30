import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Platform,
} from "react-native";
import { View, Text, TouchableOpacity, TextField } from "react-native-ui-lib";

interface ReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (rating: string, comment: string) => void;
}

const ReviewModal = ({ isVisible, onClose, onSubmit }: ReviewModalProps) => {
  const [rating, setRating] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  const handleSubmit = () => {
    onSubmit(rating, comment);
    onClose(); // Close modal after submit
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>

          <TextField
            style={styles.input}
            placeholder="Rating (1-5)"
            keyboardType="numeric"
            value={rating}
            onChangeText={setRating}
          />

          <TextField
            style={styles.input}
            placeholder="Comment"
            value={comment}
            onChangeText={setComment}
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  input: {
    width: 150,
    height: 25,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  // Add more styles as needed
});

export default ReviewModal;
