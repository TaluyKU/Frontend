import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Picker,
} from "react-native-ui-lib";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import axios from "axios";
import { calculateDistance } from "#src/utils/calculateDistance";
import { useCurrentLocation } from "#src/hooks/useCurrentLocation";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { Place } from "#src/interfaces/PlaceInterface";
import { PulsatingMarker } from "#src/components/PulsatingMarker";

const CARD_HEIGHT = 220;
const CARD_WIDTH = 430 * 0.8;
const spacingForCardInsert = 430 * 0.1 - 10;

interface RootStackParamList {
  Map: { category: string };
  [key: string]: object | undefined;
}

interface MapScreenProp {
  route: RouteProp<RootStackParamList, "Map">;
  navigation: NavigationProp<RootStackParamList, "Map">;
}

const MapScreen = ({ navigation, route }: MapScreenProp) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const { location } = useCurrentLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    route.params.category
  );
  const [categories, setCategories] = useState<string[]>(["All"]);

  const center = location
    ? {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      }
    : { lat: 13.845388, lng: 100.570557 };

  useEffect(() => {
    const fetchPlacesAndCategories = async () => {
      try {
        const placesResponse = await axios.get<Place[]>(
          `${process.env.BASE_URL}/place/all`
        );
        setPlaces(placesResponse.data);
        const categoriesResponse = await axios.get<string[]>(
          `${process.env.BASE_URL}/category/all`
        );
        setCategories(["All", ...categoriesResponse.data]);
      } catch (error) {
        console.error("Fetching data error:", error);
      }
    };

    fetchPlacesAndCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(route.params.category);
  }, [route.params.category]);

  const filteredPlaces = places.filter(
    (place) =>
      selectedCategory === "All" || place.categories.includes(selectedCategory)
  );

  return (
    <View style={styles.container} useSafeArea>
      <Picker
        key={selectedCategory}
        value={selectedCategory}
        onChange={(value: any) => setSelectedCategory(value)}
        style={styles.picker}
      >
        {categories.map((category, index) => (
          <Picker.Item key={index} label={category} value={category} />
        ))}
      </Picker>

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
                  onPress={() =>
                    navigation.navigate("Place", { placeId: place._id })
                  }
                >
                  <View style={styles.calloutView}>
                    {place.images && (
                      <Image
                        source={{
                          uri: `${process.env.IMAGE_BUCKET_BASE_URL}/${place.images[0]}`,
                        }}
                        style={{ width: 200, height: 100 }}
                      />
                    )}
                    <Text style={styles.calloutTitle}>{place.name}</Text>
                    <TouchableOpacity style={styles.calloutButton}>
                      <Text style={styles.calloutButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
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
  },
  map: {
    flex: 1,
  },
  calloutView: {
    width: 200, // Adjust based on content
    padding: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  calloutButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  calloutButtonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default MapScreen;
