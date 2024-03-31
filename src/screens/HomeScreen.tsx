import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Animated, ActivityIndicator, ScrollView } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { View, Carousel, Text, Image, Card, TouchableOpacity } from 'react-native-ui-lib';
import axios, { AxiosResponse } from 'axios';
import { Place } from '#src/interfaces/PlaceInterface';
import Colors from '#src/constants/Colors';
import { FlatList } from 'react-native-gesture-handler';
import PlaceRecommendComponent from '#src/components/home/PlaceRecommend';
import { useCurrentLocation } from '#src/hooks/useCurrentLocation';
import AllPLaceCard from '#src/components/home/AllPlaceCard';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  // ================== useState ==================

  const [transportationData, setTransportationData] = useState<Place[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>('ใกล้ฉัน');
  const [recommendedPlaces, setRecommendedPlaces] = useState<Place[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const { location, errorMsg } = useCurrentLocation();
  const tabs = ['ใกล้ฉัน', 'ยอดนิยม', 'ใหม่'];

  // ================== useEffect ==================

  useEffect(() => {
    getAllPlace();
    fetchRecommendedPlaces(selectedContent);
  }, []);

  useEffect(() => {
    fetchRecommendedPlaces(selectedContent);
  }, [selectedContent]);

  // ================== function ==================

  const getAllPlace = () => {
    axios
      .get(`${process.env.BASE_URL}/place/all`)
      .then((response: AxiosResponse) => {
        const data = response.data;
        setTransportationData(data.slice(0, 3));
        setAllPlaces(data);
      })
      .catch((error: any) => {
        console.error(`getAllTransportation error ${error}`);
      });
  };

  const fetchRecommendedPlaces = async (type: string) => {
    try {
      if (type == 'ใกล้ฉัน' && location) {
        const response = await axios.get(
          `${process.env.BASE_URL}/place/nearby/${location.coords.latitude}/${location.coords.longitude}`
        );
        setRecommendedPlaces(response.data);
      } else if (type == 'ยอดนิยม') {
        const response = await axios.get(`${process.env.BASE_URL}/place/popular`);
        setRecommendedPlaces(response.data);
        console.log(response.data);
      } else if (type == 'ใหม่') {
        const response = await axios.get(`${process.env.BASE_URL}/place/newest`);
        setRecommendedPlaces(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Carousel
        containerStyle={styles.carousel}
        autoplay
        autoplayInterval={10000}
        allowAccessibleLayout
        loop
        pageControlPosition={Carousel.pageControlPositions.OVER}
      >
        {transportationData.map((item, index) => {
          return (
            <View key={index} style={styles.carouselCard}>
              <ImageBackground
                source={{
                  uri: item.images && `${process.env.IMAGE_BUCKET_BASE_URL}/${item.images[0]}`,
                }}
                style={styles.carouselImage}
                resizeMode="cover"
              >
                <View useSafeArea>
                  <Text style={styles.carouselText}>{item.name}</Text>
                  <Text style={styles.carouselText}>{item.generalInfo}</Text>
                </View>
              </ImageBackground>
            </View>
          );
        })}
      </Carousel>

      {/*  nav bar */}
      <View style={styles.menu}>
        <Card
          style={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map');
          }}
        >
          <Image source={require('#assets/images/home/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>แผนที่</Text>
        </Card>
        <Card
          style={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map', { category: 'คาเฟ่' });
          }}
        >
          <Image source={require('#assets/images/home/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>คาเฟ่</Text>
        </Card>
        <Card
          style={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map', { category: 'ร้านอาหาร' });
          }}
        >
          <Image source={require('#assets/images/home/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>ร้านอาหาร</Text>
        </Card>
        <Card
          style={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map', { category: 'ห้องน้ำ' });
          }}
        >
          <Image source={require('#assets/images/home/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>ห้องน้ำ</Text>
        </Card>
        <Card
          containerStyle={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map', { category: 'จุดถ่ายภาพ' });
          }}
        >
          <Image source={require('#assets/images/home/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>จุดถ่ายภาพ</Text>
        </Card>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          {/* tab */}
          <View style={styles.recommendTab}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedContent(tab)}
                style={[styles.tab, selectedContent === tab && styles.selectedTab]}
              >
                <Text style={selectedContent === tab && styles.selectedTabText}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginTop: 10 }}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <FlatList
                data={recommendedPlaces}
                contentContainerStyle={styles.contentContainer}
                renderItem={({ item }) => (
                  <PlaceRecommendComponent
                    place={item}
                    navigation={navigation}
                    location={location}
                  />
                )}
                keyExtractor={(item) => item._id}
                horizontal
                style={styles.recommendPlace}
              />
            )}
          </View>

          <View
            style={{
              alignItems: 'center',
              marginTop: 28,
              marginBottom: 20,
            }}
          >
            {allPlaces.map((place) => (
              <AllPLaceCard place={place} navigation={navigation} location={location} />
            ))}
          </View>
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
  },
  carousel: { height: 250, marginBottom: 10 },
  carouselCard: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  carouselImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  carouselText: {
    left: 20,
    fontSize: 20,
  },
  menu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
  },
  menuCard: {
    width: '18%',
    aspectRatio: 1.15,
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.3,
    borderColor: Colors.outline,
  },
  menuIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  menuText: {
    fontSize: 10,
  },
  recommendPlace: {},
  recommendTab: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  tab: {
    padding: 10,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.highlight,
  },
  selectedTabText: {
    color: Colors.highlight,
    // textDecorationLine: 'underline',
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
});

export default HomeScreen;

//TODO: map cate กดไม่ได้
