import Colors from '#src/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

interface TagInputProps {
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  placeHolder: string;
}

const TagInputComponent = ({ selectedItems, setSelectedItems, placeHolder }: TagInputProps) => {
  const [text, setText] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const addTag = (): void => {
    if (text.trim() !== '') {
      if (editIndex !== null) {
        const newTags = [...selectedItems];
        newTags[editIndex] = text.trim();
        setSelectedItems(newTags);
        setEditIndex(null);
      } else {
        setSelectedItems([...selectedItems, text.trim()]);
      }
      setText('');
    }
  };

  const removeTag = (index: number): void => {
    const newTags = [...selectedItems];
    newTags.splice(index, 1);
    setSelectedItems(newTags);
  };

  const editTag = (index: number): void => {
    const tagToEdit = selectedItems[index];
    setText(tagToEdit);
    setEditIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeHolder}
          value={text}
          onChangeText={setText}
          onSubmitEditing={addTag}
        />
        <TouchableOpacity onPress={addTag} style={styles.addButton}>
          <Text style={styles.buttonText}>{editIndex !== null ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tagContainer}>
        {selectedItems.map((tag, index) => (
          <View key={index} style={styles.tagWrapper}>
            <TouchableOpacity onPress={() => editTag(index)} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeTag(index)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginRight: 5,
  },
  tag: {
    backgroundColor: Colors.highlight,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    color: 'black',
    fontSize: 13,
  },
  removeButton: {
    marginLeft: 5,
    paddingHorizontal: 4,
    apddingVertical: 1,
    borderRadius: 10,
    backgroundColor: '#E53935',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: Colors.outline,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TagInputComponent;
