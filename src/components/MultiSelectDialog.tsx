import Colors from '#src/constants/Colors';
import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { Button, Incubator } from 'react-native-ui-lib';

interface MultiSelectDialogProps {
  items: string[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  title: string;
}

const MultiSelectDialog = ({
  items,
  selectedItems,
  setSelectedItems,
  title,
}: MultiSelectDialogProps) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <View>
      <Button
        label={title}
        outline
        outlineColor={Colors.highlight}
        size="small"
        onPress={() => setIsDialogVisible(true)}
        style={{ width: '35%', marginBottom: 10 }}
      />
      <Incubator.Dialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}
        containerStyle={styles.dialogContainer}
        useSafeArea
      >
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, selectedItems.includes(item) && styles.selectedItem]}
              onPress={() => toggleItem(item)}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </Incubator.Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  dialogContainer: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
});

export default MultiSelectDialog;
