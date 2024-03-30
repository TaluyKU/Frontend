import React from 'react';
import { StyleSheet } from 'react-native';
import { Place } from '#interfaces/PlaceInterface';
import { TouchableOpacity, View, Text, Image } from 'react-native-ui-lib';

const PlaceRecommendComponent = ({ place }: { place: Place }) => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Image
          source={{ uri: `${process.env.IMAGE_BUCKET_BASE_URL}/${place.images?.[0]}` }}
          style={styles.image}
        />
        <Text style={styles.name}>{place.name}</Text>
        <Text>{place.generalInfo}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    width: 170,
    height: 133,
    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
});

export default PlaceRecommendComponent;
