import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Animated } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { View, Carousel, Text, Image, Card } from 'react-native-ui-lib';
import axios, { AxiosResponse } from 'axios';
import { Place } from '#src/interfaces/PlaceInterface';
import Colors from '#src/constants/Colors';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [transportationData, setTransportationData] = useState<Place[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>('ใกล้ที่สุด');
  const contents = ['ใกล้ที่สุด', 'ยอดนิยม', 'มาใหม่'];
  const [popularPlaces, setPopularPlaces] = useState<Place[]>([]);

  const getAllPlace = () => {
    axios
      .get(`${process.env.BASE_URL}/place/all`)
      .then((response: AxiosResponse) => {
        const data = response.data;
        setTransportationData(data.slice(0, 3));
      })
      .catch((error: any) => {
        console.error(`getAllTransportation error ${error}`);
      });
  };

  useEffect(() => {
    getAllPlace();
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`${process.env.BASE_URL}/place/popular`);
        setPopularPlaces(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaces();
  }, []);

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

      <View style={styles.menu}>
        <Card
          style={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map');
          }}
        >
          <Image source={require('#assets/images/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>แผนที่</Text>
        </Card>
        <Card
          style={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map', { category: 'คาเฟ่' });
          }}
        >
          <Image source={require('#assets/images/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>คาเฟ่</Text>
        </Card>
        <Card
          style={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map', { category: 'ร้านอาหาร' });
          }}
        >
          <Image source={require('#assets/images/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>ร้านอาหาร</Text>
        </Card>
        <Card
          style={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map', { category: 'ห้องน้ำ' });
          }}
        >
          <Image source={require('#assets/images/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>ห้องน้ำ</Text>
        </Card>
        <Card
          containerStyle={styles.menuCard}
          onPress={() => {
            navigation.navigate('Map', { category: 'จุดถ่ายภาพ' });
          }}
        >
          <Image source={require('#assets/images/menu.png')} style={styles.menuIcon} />
          <Text style={styles.menuText}>จุดถ่ายภาพ</Text>
        </Card>
      </View>
      {/* <FlatList
          data={popularPlaces}
          renderItem={({ item }) => <PlaceComponent place={item} />}
          keyExtractor={(item) => item._id}
        /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
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
});

export default HomeScreen;

//TODO: comment ไม่เข้า
//TODO: map cate กดไม่ได้
//TODO: เลื่อนไม่ได้
