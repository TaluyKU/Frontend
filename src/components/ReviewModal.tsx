import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { TextField } from 'react-native-ui-lib';

interface ReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (rating: string, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isVisible, onClose, onSubmit }) => {
  const [rating, setRating] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(rating, comment);
    onClose();
  };

  interface RatingOptionProps {
    score: string;
  }

  const RatingOption: React.FC<RatingOptionProps> = ({ score }) => (
    <TouchableOpacity
      style={[styles.ratingOption, rating === score && styles.selectedRatingOption]}
      onPress={() => setRating(score)}
    >
      <Text style={styles.ratingText}>{score}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>

          <View style={styles.ratingContainer}>
            {['1', '2', '3', '4', '5'].map((score) => (
              <RatingOption key={score} score={score} />
            ))}
          </View>

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  input: {
    width: 200,
    minHeight: 40,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  ratingOption: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedRatingOption: {
    borderColor: '#2196F3',
  },
  ratingText: {
    textAlign: 'center',
  },
});

export default ReviewModal;
