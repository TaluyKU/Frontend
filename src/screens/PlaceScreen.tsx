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
import Colors from '#src/constants/Colors';

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
    averageRatingLabel: '',
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
        getReview();
      })
      .catch((error) => {
        console.error(`handleReviewSubmit error ${error}`);
      });
  };
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
  const rateColor = changeRateColor(place.averageRatingLabel);

  return (
    <ScrollView style={styles.container}>
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
        <View style={styles.rating}>
          <Text
            text70
            style={{
              marginRight: 10,
              borderColor: rateColor,
              borderWidth: 1,
              padding: 2,
              bottom: 3,
              paddingRight: 4,
              paddingLeft: 4,
              color: rateColor,
              fontWeight: '700',
            }}
          >
            {place.averageRatingLabel}
          </Text>
          <Text text70>{review.length} ratings</Text>
        </View>
        <View
          style={{
            width: 350,
            backgroundColor: 'rgba(164, 164, 164, 1)',
            height: 1,
            marginBottom: 10,
            marginTop: 10,
          }}
        ></View>
        <TouchableOpacity style={styles.favorite} onPress={handleFavorite}>
          {isFavorite ? (
            <Icon source={require('#assets/images/place/badge-color.png')} size={30} />
          ) : (
            <Icon source={require('#assets/images/place/badge-nocolor.png')} size={30} />
          )}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          {place.weeklySchedule && (
            <View style={styles.section}>
              <Icon source={require('#assets/images/place/weekly.png')} size={20} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.sectionTitle}>Weekly Schedule</Text>
                {place.weeklySchedule.map((schedule, index) => (
                  <Text
                    key={index}
                  >{`${schedule.date}: ${schedule.time.start.hour}:${schedule.time.start.minute} - ${schedule.time.end.hour}:${schedule.time.end.minute}`}</Text>
                ))}
              </View>
            </View>
          )}
          {place.phone && (
            <View style={styles.section}>
              <Icon source={require('#assets/images/place/phone.png')} size={20} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.sectionTitle}>Phone</Text>
                {place.phone.map((phone, index) => (
                  <Text key={index}>{phone}</Text>
                ))}
              </View>
            </View>
          )}
          {place.website && (
            <View style={styles.section}>
              <Icon source={require('#assets/images/place/website.png')} size={20} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.sectionTitle}>Website</Text>
                {place.website.map((website, index) => (
                  <Text key={index}>{website}</Text>
                ))}
              </View>
            </View>
          )}
          {place.email && (
            <View style={styles.section}>
              <Icon source={require('#assets/images/place/email.png')} size={20} />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.sectionTitle}>Email</Text>
                {place.email.map((email, index) => (
                  <Text key={index}>{email}</Text>
                ))}
              </View>
            </View>
          )}
          <View
            style={{
              width: 350,
              backgroundColor: 'rgba(164, 164, 164, 1)',
              height: 1,
              marginBottom: 20,
              marginTop: 10,
            }}
          ></View>
        </View>
        <Button
          label="เพิ่มความคิดเห็น"
          onPress={() => setReviewModalVisible(true)}
          style={{ backgroundColor: '#E1F0DA', borderRadius: 10 }}
          color={'black'}
        />
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
    backgroundColor: Colors.background,
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
  rating: {
    flex: 1,
    flexDirection: 'row',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#F8F5E8',
    marginTop: 16,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default PlaceScreen;
