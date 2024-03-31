import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, FlatList } from 'react-native';
import { View, TextField, Button, Text, Image } from 'react-native-ui-lib';
import axios from 'axios';
import { Place } from '#src/interfaces/PlaceInterface';
import MapView, { Marker, PROVIDER_GOOGLE, LatLng } from 'react-native-maps';
import { useCurrentLocation } from '#src/hooks/useCurrentLocation';
import Colors from '#src/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import MultiSelectDialog from '#src/components/MultiSelectDialog';
import TagInputComponent from '#src/components/TagsInput';

const AddPlaceScreen = () => {
  let { location } = useCurrentLocation();
  const [place, setPlace] = useState<Partial<Place>>({
    location: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [selectedLocation, setSelectedLocation] = useState<LatLng>({
    latitude: 0,
    longitude: 0,
  });
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [date, setDate] = useState<string[]>([]);
  const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (location) {
      setPlace({
        ...place,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}/category/all`);
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!place.name || !place.location || !place.categories) {
        alert('กรุณากรอกขื่อ หมวดหมู่ และตำแหน่งสถานที่');
        return;
      }
      genWeeklySchedule();
      const uploadedPlace = await axios.post(`${process.env.BASE_URL}/place/create`, place);
      console.log('Uploaded:', uploadedPlace.data);
      handleUploadImage(uploadedPlace.data._id);
    } catch (error) {
      console.error('Error submitting place:', error);
    }
  };

  const mapRegion = {
    latitude: location?.coords.latitude || 37.78825,
    longitude: location?.coords.longitude || -122.4324,
    latitudeDelta: 0.001,
    longitudeDelta: 0.002,
  };

  const selectLocationHandler = (event: LatLng) => {
    setPlace({
      ...place,
      location: { latitude: event.latitude, longitude: event.longitude },
    });
    setSelectedLocation({
      latitude: event.latitude,
      longitude: event.longitude,
    });
  };

  const handleImagePicker = () => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then((permission) => {
      if (permission.status === 'granted') {
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.5,
          base64: true,
          allowsMultipleSelection: true,
        }).then((result) => {
          if (!result.canceled) {
            const imagesBase64 = result.assets.map((image) => image.base64);
            const filteredImagesBase64 = imagesBase64.filter(
              (image) => image !== null && image !== undefined
            );
            setSelectedImages(filteredImagesBase64);
          }
        });
      }
    });
  };

  const handleUploadImage = (placeId: string) => {
    if (selectedImages.length === 0) {
      return;
    }
    axios
      .post(`${process.env.BASE_URL}/upload/images`, {
        imagesBase64: selectedImages,
        placeId: placeId,
      })
      .then((response) => {
        console.log('Success:', response.data);
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
      });
  };

  const genWeeklySchedule = () => {
    const weeklySchedule: any = [];
    date.map((day) => {
      const time = {
        start: {
          hour: '00',
          minute: '00',
        },
        end: {
          hour: '23',
          minute: '59',
        },
      };
      weeklySchedule.push({ date: day, time });
    });
    setPlace({ ...place, weeklySchedule });
  };

  return (
    <View useSafeArea flex style={{ backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
        <Text text60M marginB-20>
          ข้อมูลสถานที่
        </Text>
        <MapView
          style={styles.map}
          region={mapRegion}
          onPress={(event) => {
            selectLocationHandler(event.nativeEvent.coordinate);
          }}
          provider={PROVIDER_GOOGLE}
        >
          {selectedLocation && <Marker coordinate={selectedLocation} />}
        </MapView>

        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text text70 style={{ width: '100%', alignItems: 'flex-start', marginBottom: 10 }}>
            ชื่อสถานที่
          </Text>
          <TextField
            placeholder="ชื่อสถานที่"
            onChangeText={(text) => setPlace({ ...place, name: text })}
            value={place.name}
            style={{
              borderWidth: 1,
              borderColor: Colors.outline,
              borderRadius: 7,
              height: 40,
              paddingHorizontal: 10,
              marginBottom: 5,
            }}
            containerStyle={{ width: '100%', marginBottom: 0 }}
          />
          <TagInputComponent
            selectedItems={place.alternativeNames || []}
            setSelectedItems={(items) => setPlace({ ...place, alternativeNames: items })}
            placeHolder="ชื่อเรียกอื่นๆ"
          />
          <TextField
            placeholder="คำอธิบายสถานที่"
            onChangeText={(text) => setPlace({ ...place, generalInfo: text })}
            value={place.generalInfo}
            style={{
              borderWidth: 1,
              borderColor: Colors.outline,
              borderRadius: 7,
              minHeight: 40,
              paddingHorizontal: 10,
              marginBottom: 10,
            }}
            containerStyle={{ width: '100%', marginBottom: 0 }}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 10,
              backgroundColor: Colors.secondary,
              borderRadius: 10,
              minHeight: 50,
              width: '100%',
              marginBottom: 5,
            }}
          >
            {selectedImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: `data:image/jpg;base64,${image}` }}
                style={{
                  width: 100,
                  height: 100,
                  marginRight: 10,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              />
            ))}
          </View>
          <Button
            label="เพิ่มรูปภาพ"
            onPress={handleImagePicker}
            outline
            outlineColor={Colors.highlight}
            style={{ width: '30%', marginBottom: 10 }}
            size="small"
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 10,
              backgroundColor: Colors.secondary,
              borderRadius: 10,
              minHeight: 50,
              width: '100%',
              marginBottom: 5,
            }}
          >
            {(place.categories || []).map((cate, index) => (
              <View
                key={index}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  backgroundColor: Colors.highlight,
                  borderColor: Colors.outline,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  overflow: 'hidden',
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.text,
                    fontWeight: 'bold',
                  }}
                >
                  {cate}
                </Text>
              </View>
            ))}
          </View>
          <MultiSelectDialog
            items={categories}
            selectedItems={place.categories || []}
            setSelectedItems={(items) => setPlace({ ...place, categories: items })}
            title="เลือกหมวดหมู่"
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 10,
              backgroundColor: Colors.secondary,
              borderRadius: 10,
              minHeight: 50,
              width: '100%',
              marginBottom: 5,
            }}
          >
            {(date || []).map((cate, index) => (
              <View
                key={index}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  backgroundColor: Colors.highlight,
                  borderColor: Colors.outline,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  overflow: 'hidden',
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: Colors.text,
                    fontWeight: 'bold',
                  }}
                >
                  {cate}
                </Text>
              </View>
            ))}
          </View>
          <MultiSelectDialog
            items={day}
            selectedItems={date}
            setSelectedItems={setDate}
            title="เลือกวันที่เปิด"
          />

          <TagInputComponent
            selectedItems={place.phone || []}
            setSelectedItems={(items) => setPlace({ ...place, phone: items })}
            placeHolder="เบอร์โทรศัพท์"
          />
          <TagInputComponent
            selectedItems={place.website || []}
            setSelectedItems={(items) => setPlace({ ...place, website: items })}
            placeHolder="เว็บไซต์"
          />
          <TagInputComponent
            selectedItems={place.email || []}
            setSelectedItems={(items) => setPlace({ ...place, email: items })}
            placeHolder="อีเมลล์"
          />
          <Button
            label="Submit"
            backgroundColor={Colors.highlight}
            onPress={() => handleSubmit()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    flexGrow: 1,
  },
  map: {
    width: '100%',
    height: 250,
    borderColor: Colors.outline,
    borderWidth: 0.5,
    borderRadius: 10,
    marginBottom: 20,
  },
  dialogContainer: {
    backgroundColor: 'white',
    padding: 20,
    maxHeight: '80%',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AddPlaceScreen;
