import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Picker,
  Incubator,
  PanningProvider,
  Icon,
} from 'react-native-ui-lib';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import { calculateDistance } from '#src/utils/calculateDistance';
import { useCurrentLocation } from '#src/hooks/useCurrentLocation';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Place } from '#src/interfaces/PlaceInterface';
import { PulsatingMarker } from '#src/components/PulsatingMarker';
import Colors from '#src/constants/Colors';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const CARD_HEIGHT = 220;
const CARD_WIDTH = 430 * 0.8;
const spacingForCardInsert = 430 * 0.1 - 10;

interface RootStackParamList {
  Map: { category: string };
  [key: string]: object | undefined;
}

interface MapScreenProp {
  route: RouteProp<RootStackParamList, 'Map'>;
  navigation: NavigationProp<RootStackParamList, 'Map'>;
}

const MapScreen = ({ navigation, route }: MapScreenProp) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const { location } = useCurrentLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(route.params.category);
  const [categories, setCategories] = useState<string[]>(['All']);

  const center = location
    ? {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      }
    : { lat: 13.845388, lng: 100.570557 };

  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      fetchPlacesAndCategories();
    }, [isFocused])
  );

  const fetchPlacesAndCategories = async () => {
    try {
      const placesResponse = await axios.get<Place[]>(`${process.env.BASE_URL}/place/all`);
      setPlaces(placesResponse.data);
      const categoriesResponse = await axios.get<string[]>(`${process.env.BASE_URL}/category/all`);
      setCategories(['All', ...categoriesResponse.data]);
    } catch (error) {
      console.error('Fetching data error:', error);
    }
  };

  useEffect(() => {
    fetchPlacesAndCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(route.params.category);
  }, [route.params.category]);

  const filteredPlaces = places.filter(
    (place) => selectedCategory === 'All' || place.categories.includes(selectedCategory)
  );

  const renderDialog = (modalProps: any) => {
    const { visible, children, toggleModal, onDone } = modalProps;

    return (
      <Incubator.Dialog
        visible={visible}
        onDismiss={() => {
          onDone();
          toggleModal();
        }}
        width="100%"
        height="60%"
        bottom
        containerStyle={{
          backgroundColor: Colors.background,
        }}
        direction={PanningProvider.Directions.DOWN}
        headerProps={{ title: 'หมวดหมู่' }}
      >
        <ScrollView>{children}</ScrollView>
      </Incubator.Dialog>
    );
  };

  return (
    <View style={styles.container} useSafeArea>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Picker
          key={selectedCategory}
          value={selectedCategory}
          onChange={(value: any) => {
            {
              setSelectedCategory(value);
            }
          }}
          style={styles.picker}
          useSafeArea
          // renderCustomModal={renderDialog}
          renderCustomModal={renderDialog}
        >
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
        <Icon
          source={require('#assets/images/map/arrow-circle.png')}
          size={20}
          style={{ position: 'relative' }}
        />
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.006,
        }}
      >
        {location && (
          <PulsatingMarker
            coords={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        )}

        {filteredPlaces &&
          filteredPlaces.map((place, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: place.location.latitude,
                  longitude: place.location.longitude,
                }}
                title={place.name}
              >
                <Callout
                  style={{ borderRadius: 10 }}
                  onPress={() => navigation.navigate('Place', { placeId: place._id })}
                >
                  <View style={styles.calloutView}>
                    {place.images && (
                      <Image
                        source={{
                          uri: `${process.env.IMAGE_BUCKET_BASE_URL}/${place.images[0]}`,
                        }}
                        style={{ width: '100%', height: 100, borderRadius: 5 }}
                      />
                    )}
                    <Text style={styles.calloutTitle}>{place.name}</Text>
                    <TouchableOpacity style={styles.calloutButton}>
                      <Text style={styles.calloutButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
                <Image
                  source={require('#assets/images/map/placeholder.png')}
                  style={{ width: 40, height: 40 }}
                />
              </Marker>
            );
          })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  calloutView: {
    width: 200, // Adjust based on content
    padding: 10,
    borderRadius: 10,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  calloutButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  calloutButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  picker: {
    height: 50,
    backgroundColor: Colors.background,
    marginHorizontal: 20,
  },
});

export default MapScreen;
