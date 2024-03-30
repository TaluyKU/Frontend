import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Image, Text, TouchableOpacity, View, Icon, Button } from 'react-native-ui-lib';
import { useCurrentLocation } from '#hooks/useCurrentLocation';
import { Place } from '#interfaces/PlaceInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateDistance } from '#src/utils/calculateDistance';
import ReviewModal from '#components/ReviewModal';
import { Review } from '#src/interfaces/ReviewInterface';

type RootStackParamList = {
  Place: { placeId: string };
};

type PlaceScreenRouteProp = RouteProp<RootStackParamList, 'Place'>;
type PlaceScreenNavigationProp = NavigationProp<RootStackParamList, 'Place'>;

type PlaceScreenProps = {
  route: PlaceScreenRouteProp;
  navigation: PlaceScreenNavigationProp;
};

const { width, height } = Dimensions.get('window');

const PlaceScreen = ({ navigation, route }: PlaceScreenProps) => {
  const [place, setPlace] = useState<Place>({
    _id: '',
    name: '',
    alternativeNames: [],
    location: { latitude: 0, longitude: 0 },
    generalInfo: '',
    images: [],
    weeklySchedule: [],
    categories: [],
    phone: [],
    website: [],
    email: [],
    reviewsCountLastMonth: 0,
    averageRating: 0,
    createdAt: new Date(),
  });
  const { location, errorMsg } = useCurrentLocation();
  const { placeId } = route.params;
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const [review, setReview] = useState<Review[]>([]);
  const distance = location
    ? calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        place.location.latitude,
        place.location.longitude
      )
    : null;

  const getPlace = () => {
    axios
      .get(`${process.env.BASE_URL}/place/find/${placeId}`)
      .then((response) => {
        const data = response.data;
        setPlace(data);
      })
      .catch((error) => {
        console.error(`getPlace error ${error}`);
      });
  };

  const getFavorite = async () => {
    axios
      .get(`${process.env.BASE_URL}/place/is_favorite/${placeId}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setIsFavorite(response.data);
      })
      .catch((error) => {
        console.error(`getFavorite error ${error}`);
      });
  };

  const getReview = async () => {
    axios
      .get(`${process.env.BASE_URL}/place/review/${placeId}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setReview(response.data);
      })
      .catch((error) => {
        console.error(`getReview error ${error}`);
      });
  };

  useEffect(() => {
    getPlace();
    getFavorite();
    getReview();
  }, []);

  const handleFavorite = async () => {
    if (isFavorite) {
      axios
        .post(
          `${process.env.BASE_URL}/place/unfavorite`,
          { placeId: placeId },
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          setIsFavorite(false);
        })
        .catch((error) => {
          console.error(`handleFavorite error ${error}`);
        });
    } else {
      axios
        .post(
          `${process.env.BASE_URL}/place/favorite`,
          { placeId: placeId },
          {
            headers: {
              Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
            },
          }
        )
        .then((response) => {
          setIsFavorite(true);
        })
        .catch((error) => {
          console.error(`handleFavorite error ${error}`);
        });
    }
  };

  const handleReviewSubmit = async (rating: string, comment: string) => {
    axios
      .post(
        `${process.env.BASE_URL}/place/review/post`,
        { placeId: placeId, rating: rating, review: comment },
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        getPlace();
      })
      .catch((error) => {
        console.error(`handleReviewSubmit error ${error}`);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {place.images &&
          place.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: `${process.env.IMAGE_BUCKET_BASE_URL}/${image}` }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{place.name}</Text>
        <Text style={styles.distance}>{distance} m</Text>
        <Text style={styles.info}>{place.generalInfo}</Text>
        <TouchableOpacity style={styles.favorite} onPress={handleFavorite}>
          {isFavorite ? (
            <Icon source={require('#assets/images/badge-color.png')} size={30} />
          ) : (
            <Icon source={require('#assets/images/badge-nocolor.png')} size={30} />
          )}
        </TouchableOpacity>
        {place.weeklySchedule && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Schedule</Text>
            {place.weeklySchedule.map((schedule, index) => (
              <Text
                key={index}
              >{`${schedule.date}: ${schedule.time.start.hour}:${schedule.time.start.minute} - ${schedule.time.end.hour}:${schedule.time.end.minute}`}</Text>
            ))}
          </View>
        )}
        {place.phone && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phone</Text>
            {place.phone.map((phone, index) => (
              <Text key={index}>{phone}</Text>
            ))}
          </View>
        )}
        {place.website && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Website</Text>
            {place.website.map((website, index) => (
              <Text key={index}>{website}</Text>
            ))}
          </View>
        )}
        {place.email && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Email</Text>
            {place.email.map((email, index) => (
              <Text key={index}>{email}</Text>
            ))}
          </View>
        )}
        <Button label="Add Review" onPress={() => setReviewModalVisible(true)} />
        <ReviewModal
          isVisible={reviewModalVisible}
          onClose={() => setReviewModalVisible(false)}
          onSubmit={handleReviewSubmit}
        />
        {review.map((review, index) => (
          <View key={index} style={styles.review}>
            <Text>{`User: ${review.userId}`}</Text>
            <Text>{`Rating: ${review.rating}`}</Text>
            <Text>{`Comment: ${review.comment}`}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  distance: {
    marginBottom: 16,
  },
  info: {
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    height: 230,
    width: width,
  },
  image: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  favorite: {
    position: 'absolute',
    top: 0,
    right: 20,
  },
  review: {
    marginBottom: 16,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});

export default PlaceScreen;
