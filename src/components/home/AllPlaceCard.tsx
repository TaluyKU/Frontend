import React from 'react';
import { StyleSheet } from 'react-native';
import { Place } from '#interfaces/PlaceInterface';
import { TouchableOpacity, View, Text, Image } from 'react-native-ui-lib';
import { NavigationProp } from '@react-navigation/native';
import { calculateDistance } from '#src/utils/calculateDistance';
import { LocationObject } from 'expo-location';

const AllPLaceCard = ({
  place,
  navigation,
  location,
}: {
  place: Place;
  navigation: NavigationProp<any>;
  location: LocationObject | null;
}) => {
  const changeRateColor = (rate: string) => {
    if (rate === 'A') {
      return '#52AC66';
    } else if (rate === 'B' || rate === 'B+') {
      return '#87AE54';
    } else if (rate === 'C' || rate === 'C+') {
      return '#ADAA54';
    } else if (rate === 'D' || rate === 'D+') {
      return '#AD7353';
    } else if (rate === 'F') {
      return '#B15555';
    }
  };

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
        <View style={{ marginLeft: 14.12, paddingTop: 6 }}>
          <Text style={styles.gradeTitle}>{place.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {calculateGarde(place.averageRating) !== '' && (
              <Text
                style={{
                  ...styles.gradeTitle,
                  marginRight: 4,
                  color: changeRateColor(calculateGarde(place.averageRating)),
                }}
              >
                {calculateGarde(place.averageRating)}
              </Text>
            )}
            <Text style={styles.countText}>{place.reviewsCountLastMonth} คนให้คะแนน</Text>
          </View>
          <View style={{ marginTop: 5 }}>
            <Text style={{ ...styles.categoryText }}>{place.categories.join(',')}</Text>
          </View>
          <Text style={styles.distant}>{distant}m</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 12, width: 90, overflow: 'hidden' },
  distant: { fontSize: 10, color: '#595959', marginTop: 5 },

  container: {
    width: 350,
    height: 75,
    marginTop: 9,
    borderRadius: 7,
    overflow: 'hidden',
    flexDirection: 'row',
    backgroundColor: '#EAE7DCF2',
  },
  name: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 7,
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
  categoryText: { color: '#595959', fontSize: 10 },
  countText: { color: '#595959', fontSize: 8 },
});

export default AllPLaceCard;
