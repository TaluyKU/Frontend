import React from 'react';
import { StyleSheet } from 'react-native';
import { Place } from '#interfaces/PlaceInterface';
import { TouchableOpacity, View, Text, Image } from 'react-native-ui-lib';
import { NavigationProp } from '@react-navigation/native';
import { calculateDistance } from '#src/utils/calculateDistance';
import { LocationObject } from 'expo-location';

const PlaceRecommendComponent = ({
  place,
  navigation,
  location,
}: {
  place: Place;
  navigation: NavigationProp<any>;
  location: LocationObject | null;
}) => {
  const range = [
    {
      start: 0,
      end: 2,
      grade: 'F',
    },
    {
      start: 2,
      end: 2.5,
      grade: 'D',
    },
    {
      start: 2.5,
      end: 3,
      grade: 'D+',
    },
    {
      start: 3,
      end: 3.5,
      grade: 'C',
    },
    {
      start: 3.5,
      end: 4,
      grade: 'C+',
    },
    {
      start: 4,
      end: 4.5,
      grade: 'B',
    },
    {
      start: 4.5,
      end: 5,
      grade: 'B+',
    },
    ,
    {
      start: 5,
      end: 5,
      grade: 'A',
    },
    ,
  ];

  const distant = calculateDistance(
    place.location.latitude,
    place.location.longitude,
    location ? location.coords.latitude : 0,
    location ? location.coords.longitude : 0
  );

  const calculateGarde = (rating: number) => {
    if (rating === 0) {
      return '';
    } else if (rating === 5) {
      return 'A';
    } else {
      const result = range.reduce((result, current) => {
        if (current && current.start <= rating && current.end > rating) {
          result = current.grade;
        }
        return result;
      }, '');
      return result;
    }
  };

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Place', { placeId: place._id })}>
      <View style={styles.container}>
        <Image
          source={{ uri: `${process.env.IMAGE_BUCKET_BASE_URL}/${place.images?.[0]}` }}
          style={styles.image}
        />
        <View style={styles.bottomCard}>
          <View style={styles.cardNameBlock}>
            <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
              {place.name}
            </Text>
            <Text style={styles.distant}>{distant}m</Text>
          </View>
          <View style={styles.bottomBlock}>
            {calculateGarde(place.averageRating) !== '' && (
              <View style={styles.grade}>
                <Text style={styles.gradeTitle}>{calculateGarde(place.averageRating)}</Text>
              </View>
            )}
            <View row>
              {place.categories.slice(0, 2).map((cate, index) => (
                <Text key={index} style={styles.categoryText}>
                  {cate}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottomCard: {
    width: 170,
    height: 53,
    backgroundColor: '#EAE7DCF2',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  title: { fontSize: 12, width: 90, overflow: 'hidden' },
  distant: { fontSize: 8, color: '#595959' },
  cardNameBlock: {
    alignItems: 'center',
    height: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingLeft: 9.2,
    width: 152,
    overflow: 'hidden',
  },
  bottomBlock: {
    alignItems: 'center',
    height: 16,
    flexDirection: 'row',
    marginTop: 6,
    paddingLeft: 12.2,
    width: 149,
    overflow: 'hidden',
  },
  container: {
    borderBottomColor: '#cccccc',
    width: 170,
    height: 133,
    marginLeft: 9,
    borderRadius: 7,
    overflow: 'hidden',
  },
  name: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  image: {
    width: 170,
    height: 133,
  },
  grade: {
    width: 22,
    height: 16,
    borderWidth: 1,
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9.2,
  },
  gradeTitle: { fontSize: 12 },
  categoryText: { color: '#595959', fontSize: 10, marginRight: 4 },
});

export default PlaceRecommendComponent;
