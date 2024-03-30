import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, TextField, Button, Text } from 'react-native-ui-lib';
import axios from 'axios';
import { Place } from '#src/interfaces/PlaceInterface';

const AddPlaceScreen = () => {
  const [place, setPlace] = useState<Partial<Place>>({
    location: { latitude: 0, longitude: 0 },
    categories: [],
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${process.env.BASE_URL}/place/add`, place);
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error submitting place:', error);
    }
  };

  return (
    <View useSafeArea flex>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          <Text text60M marginB-10>
            Name
          </Text>
          <TextField
            placeholder="Place Name"
            onChangeText={(text) => setPlace({ ...place, name: text })}
            value={place.name}
          />

          {/* Repeat for other fields... */}

          <Button label="Submit" onPress={() => handleSubmit()} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default AddPlaceScreen;
