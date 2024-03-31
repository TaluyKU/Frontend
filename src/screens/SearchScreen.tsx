import React, { useState } from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import { Place } from '#src/interfaces/PlaceInterface';
import axios from 'axios';
import { View, Button, Text, TextField, TouchableOpacity, Image } from 'react-native-ui-lib';
import Colors from '#src/constants/Colors';
import { NavigationProp } from '@react-navigation/native';
import AllPLaceCard from '#src/components/home/AllPlaceCard';
import { useCurrentLocation } from '#src/hooks/useCurrentLocation';

interface SearchScreenProps {
  navigation: NavigationProp<any>;
}

const { width } = Dimensions.get('window');

const SearchResultsPage = ({ navigation }: SearchScreenProps) => {
  const [results, setResults] = useState<Place[] | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const { location, errorMsg } = useCurrentLocation();

  const handleSearch = (text: string) => {
    if (!text) {
      alert('กรุณากรอกข้อความที่ต้องการค้นหา');
      return;
    }
    axios
      .get(`${process.env.BASE_URL}/place/search/${text}`)
      .then((response) => {
        setResults(response.data);
      })
      .catch((error) => {
        console.error(`Search error: ${error}`);
      });
  };

  const renderItem = ({ item }: { item: Place }) => (
    <AllPLaceCard place={item} navigation={navigation} location={location} />
  );

  return (
    <View style={styles.container} useSafeArea>
      <View row>
        <TextField
          placeholder="Search places"
          autoCapitalize="none"
          onChangeText={setSearchText}
          style={styles.searchInput}
          onSubmitEditing={() => handleSearch(searchText)}
        />
        <Button
          label="Search"
          backgroundColor={Colors.highlight}
          onPress={() => handleSearch(searchText)}
          style={styles.searchButton}
          size="small"
          paddingH-10
        />
      </View>
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.background,
  },
  searchInput: {
    width: width * 0.6,
    height: 40,
    marginBottom: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.highlight,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  searchButton: {
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  itemContainer: {
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors.outline,
    marginVertical: 8,
    width: Dimensions.get('window').width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  itemInfo: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 4,
  },
  resultContainer: {
    flex: 1,
  },
  image: {
    width: '20%',
  },
});

export default SearchResultsPage;
