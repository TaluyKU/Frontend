import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Text,
  Button,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import uuid from "react-native-uuid";
import Tags from "react-native-tags";
import { TextField, Icon } from "react-native-ui-lib";

const AddPlaceScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [alternativeName, setAlternativeName] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [generalInfo, setGeneralInfo] = useState("");
  const [imagesName, setImagesName] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [categories, setCategories] = useState([]);
  const [phone, setPhone] = useState([]);
  const [email, setEmail] = useState([]);
  const [website, setWebsite] = useState([]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [categoriesFromBackend, setCategoriesFromBackend] = useState([]);

  const [alternativeNameInput, setAlternativeNameInput] = useState("");
  const [websiteInput, setWebsiteInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [categoryStatus, setCategoryStatus] = useState("loading");

  const [dateInput, setDateInput] = useState("");
  const [displayDatePicker, setDisplayDatePicker] = useState(false);

  const [hourStartInput, sethourStartInput] = useState("");
  const [minuteStartInput, setminuteStartInput] = useState("");
  const [hourEndInput, sethourEndInput] = useState("");
  const [minuteEndInput, setminuteEndInput] = useState("");

  const dateNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    getCategories();
  }, []);

  //get categories from backend
  const getCategories = async () => {
    try {
      const response = await axios.get(`${process.env.BASE_URL}/category/all`);
      setCategoriesFromBackend(response.data);
      setCategoryStatus("success");
    } catch (error) {
      console.error(error);
      setCategoryStatus("error");
    }
  };

  const toggleDropdown = () => {
    setCategoryDropdown(!categoryDropdown);
  };

  //category dropdown
  const handleCategoryDropdown = () => {
    if (categoryDropdown) {
      if (categoryStatus === "loading") {
        return (
          <View>
            <Text>Loading...</Text>
          </View>
        );
      } else if (categoryStatus === "success") {
        return (
          <View style={styles.category}>
            {categoriesFromBackend.map((data, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAddCategory(data)}
              >
                <Text style={styles.categoryText}>{data}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      } else {
        return (
          <View>
            <Text>Error</Text>
          </View>
        );
      }
    }
  };

  const onChangedLocation = (text, setState) => {
    setState(text.replace(/[^0-9.]/g, ""));
  };

  const handleAddCategory = (value) => {
    if (!categories.includes(value)) {
      setCategories((categories) => [...categories, value]);
    }
  };

  const handleAddPhone = () => {
    if (!phone.includes(phoneInput)) {
      setPhone((phone) => [...phone, phoneInput]);
    }
    setPhoneInput("");
  };

  const handleAddAlternativeName = () => {
    if (!alternativeName.includes(alternativeNameInput)) {
      setAlternativeName((alternativeName) => [
        ...alternativeName,
        alternativeNameInput,
      ]);
    }
    setAlternativeNameInput("");
  };

  const handleAddEmail = () => {
    if (!email.includes(emailInput)) {
      setEmail((email) => [...email, emailInput]);
    }
    setEmailInput("");
  };

  const handleAddWebsite = () => {
    if (!website.includes(websiteInput)) {
      setWebsite((website) => [...website, websiteInput]);
    }
    setWebsiteInput("");
  };

  const handleRemoveData = (value, state, setState) => {
    setState(() => state.filter((data) => data !== value));
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages(result.assets);
    }
  };

  const uploadImage = async () => {
    try {
      let imagesUploaded = [];
      for (let image of selectedImages) {
        let localUri = image.uri;
        let extension = localUri.split(".").pop();

        // Generate a new UUID and append the file extension
        let uniqueName = `${uuid.v4()}.${extension}`;
        let formData = new FormData();
        formData.append("image", {
          uri: image.uri,
          name: uniqueName,
          type: "image/jpg",
        });
        try {
          await axios({
            method: "POST",
            url: `${process.env.BASE_URL}/upload`,
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          console.error(error.response.data);
        }
        imagesUploaded.push(uniqueName);
      }
      setImagesName(imagesUploaded);
      return imagesUploaded;
    } catch (error) {
      console.error(error);
    }
  };

  const sendToBackend = async () => {
    try {
      const response = await uploadImage();
      console.log(`Image Uploaded: ${response}`);
    } catch (error) {
      console.error(error);
    }
  };

  const sendBack = async () => {
    try {
      await axios({
        method: "POST",
        url: `${process.env.BASE_URL}/place/add`,
        data: {
          name,
          alternativeNames: alternativeName,
          location: [lng, lat],
          generalInfo,
          images: imagesName,
          weeklySchedule,
          categories,
          phone,
          website,
          email,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (imagesName.length > 0) {
      sendBack();
    }
  }, [imagesName]);

  const handleAddWeeklySchedule = () => {
    if (!weeklySchedule.includes(dateInput)) {
      setWeeklySchedule((weeklySchedule) => [
        ...weeklySchedule,
        {
          date: dateInput,
          time: {
            start: {
              hour: hourStartInput,
              minute: minuteStartInput,
            },
            end: {
              hour: hourEndInput,
              minute: minuteEndInput,
            },
          },
        },
      ]);
    }
    setDateInput("");
    sethourStartInput("");
    setminuteStartInput("");
    sethourEndInput("");
    setminuteEndInput("");
  };

  return (
    <SafeAreaView>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          <TextField
            placeholder={"name"}
            value={name}
            setValue={setName}
            style={styles.input}
          />

          {/* image select  */}
          <View style={styles.selectImage}>
            <Button title="Select Image" onPress={selectImage} />
            {selectedImages.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={{ width: 200, height: 200 }}
              />
            ))}
          </View>

          {/* generalInfo input */}
          <TextField
            placeholder={"generalInfo"}
            value={generalInfo}
            setValue={setGeneralInfo}
          />

          {/* lat lng input  */}
          <View style={styles.row}>
            <SafeAreaView style={styles.twoInput}>
              <TextInput
                // keyboardType="numeric"
                value={lat}
                onChangeText={(text) => onChangedLocation(text, setLat)}
                placeholder={"lat (เลขน้อย)"}
                style={styles.input}
              ></TextInput>
            </SafeAreaView>
            <SafeAreaView style={styles.twoInput}>
              <TextInput
                // keyboardType="numeric"
                value={lng}
                onChangeText={(text) => onChangedLocation(text, setLng)}
                placeholder={"lng (เลขมาก)"}
                style={styles.input}
              ></TextInput>
            </SafeAreaView>
          </View>

          {/* date picker */}
          <View
            style={{
              width: "80%",
              position: "relative",
              overflow: "visible",
              zIndex: 100,
            }}
          >
            <Pressable
              style={{
                position: "absolute",
                top: 8,
                right: 10,
                zIndex: 10,
                width: 20,
                height: 20,
                backgroundColor: "blue",
              }}
              onPress={() => {
                setDisplayDatePicker(!displayDatePicker);
              }}
            ></Pressable>
            <View style={{ position: "relative" }}>
              <View
                style={{
                  backgroundColor: "white",

                  height: 35,
                  flexDirection: "row",
                  paddingLeft: 10,
                  alignItems: "center",
                  borderColor: "#e8e8e8",
                }}
              >
                <Text>{dateInput}</Text>
              </View>
              {displayDatePicker && (
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    position: "absolute",
                    top: 45,
                  }}
                >
                  {dateNames.map((data, index) => (
                    <Pressable
                      key={index}
                      style={{
                        height: 40,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: 10,
                      }}
                      onPress={() => {
                        setDateInput(data);
                        setDisplayDatePicker(false);
                      }}
                    >
                      <Text>{data}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
          <View style={{ width: "80%", marginTop: 10, flexDirection: "row" }}>
            <TextInput
              style={{
                backgroundColor: "white",
                width: "15%",
                height: 30,
                borderColor: "#e8e8e8",
              }}
              value={hourStartInput}
              onChangeText={(text) => sethourStartInput(text)}
            ></TextInput>
            <Text style={{ fontSize: 20, width: "13%" }}> : </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                width: "15%",
                height: 30,
                borderColor: "#e8e8e8",
              }}
              value={minuteStartInput}
              onChangeText={(text) => setminuteStartInput(text)}
            ></TextInput>
            <Text style={{ fontSize: 20, width: "13%" }}> - </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                width: "15%",
                height: 30,
                borderColor: "#e8e8e8",
              }}
              value={hourEndInput}
              onChangeText={(text) => sethourEndInput(text)}
            ></TextInput>
            <Text style={{ fontSize: 20, width: "13%" }}> : </Text>
            <TextInput
              style={{
                backgroundColor: "white",
                width: "15%",
                height: 30,
                borderColor: "#e8e8e8",
              }}
              value={minuteEndInput}
              onChangeText={(text) => setminuteEndInput(text)}
            ></TextInput>
          </View>
          <Button title="Add" onPress={handleAddWeeklySchedule} />
          {weeklySchedule.map((data, index) => (
            <View key={index} style={styles.inputArray}>
              <Text style={styles.array}>
                {data.date} {data.time.start.hour}:{data.time.start.minute} -{" "}
                {data.time.end.hour}:{data.time.end.minute}
              </Text>
              <TouchableWithoutFeedback
                onPress={() =>
                  handleRemoveData(data, weeklySchedule, setWeeklySchedule)
                }
              >
                <Text style={styles.remove}>remove</Text>
              </TouchableWithoutFeedback>
            </View>
          ))}

          {/* alternative name input  */}
          {/* <View style={styles.oneInput}>
          <TextInput
          autoCapitalize="none"
          value={alternativeNameInput}
          placeholder="alternative name"
          onChangeText={(newText) => setAlternativeNameInput(newText)}
          defaultValue={"alternative name"}
          style={styles.input}
          />
          </View>
          <Button title="Add" onPress={handleAddAlternativeName} />
          
          {alternativeName.map((data, index) => (
            <View style={styles.inputArray} key={index}>
            <Text style={styles.array}>{data}</Text>
            <TouchableWithoutFeedback
            onPress={() =>
              handleRemoveData(data, alternativeName, setAlternativeName)
            }
            >
            <Text style={styles.remove}>remove</Text>
            </TouchableWithoutFeedback>
            </View>
          ))} */}

          <Tags
            initialText=""
            initialTags={alternativeName}
            onChangeTags={setAlternativeName}
            tagContainerStyle={styles.tagContainer}
            tagTextStyle={styles.tagText}
            textInputProps={{
              placeholder: "Add alternative names separated by spaces",
              placeholderTextColor: "#999",
              style: styles.tagInput,
            }}
          />

          {/* phone input  */}
          <View style={styles.oneInput}>
            <TextInput
              autoCapitalize="none"
              value={phoneInput}
              placeholder="phone"
              onChangeText={(newText) => setPhoneInput(newText)}
              defaultValue={"phone"}
              style={styles.input}
            />
          </View>
          <Button title="Add" onPress={handleAddPhone} />
          {phone.map((data, index) => (
            <View key={index} style={styles.inputArray}>
              <Text style={styles.array}>{data}</Text>
              <TouchableWithoutFeedback
                onPress={() => handleRemoveData(data, phone, setPhone)}
              >
                <Text style={styles.remove}>remove</Text>
              </TouchableWithoutFeedback>
            </View>
          ))}

          {/* email input  */}
          <View style={styles.oneInput}>
            <TextInput
              autoCapitalize="none"
              value={emailInput}
              placeholder="email"
              onChangeText={(newText) => setEmailInput(newText)}
              defaultValue={"email"}
              style={styles.input}
            />
          </View>
          <Button title="Add" onPress={handleAddEmail} />
          {email.map((data, index) => (
            <View key={index} style={styles.inputArray}>
              <Text style={styles.array}>{data}</Text>
              <TouchableWithoutFeedback
                onPress={() => handleRemoveData(data, email, setEmail)}
              >
                <Text style={styles.remove}>remove</Text>
              </TouchableWithoutFeedback>
            </View>
          ))}

          {/* website input  */}
          <View style={styles.oneInput}>
            <TextInput
              autoCapitalize="none"
              value={websiteInput}
              placeholder="website"
              onChangeText={(newText) => setWebsiteInput(newText)}
              defaultValue={"website"}
              style={styles.input}
            />
          </View>
          <Button title="Add" onPress={handleAddWebsite} />
          {website.map((data, index) => (
            <View key={index} style={styles.inputArray}>
              <Text style={styles.array}>{data}</Text>
              <TouchableWithoutFeedback
                onPress={() => handleRemoveData(data, website, setWebsite)}
              >
                <Text style={styles.remove}>remove</Text>
              </TouchableWithoutFeedback>
            </View>
          ))}

          {/* categories dropdown */}
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={toggleDropdown}
          >
            {handleCategoryDropdown()}
            <Text style={styles.dropdownButtonText}>select category</Text>
            <Icon type="font-awesome" name="chevron-down" />
          </TouchableOpacity>

          {/* selected categories */}
          {categories.map((data, index) => (
            <View style={styles.inputArray} key={index}>
              <Text style={styles.array}>{data}</Text>
              <TouchableWithoutFeedback
                onPress={() =>
                  handleRemoveData(data, categories, setCategories)
                }
              >
                <Text style={styles.remove}>remove</Text>
              </TouchableWithoutFeedback>
            </View>
          ))}

          {/* send data to back end */}
          <View style={styles.uploadButton}>
            <Button title="Add Place" onPress={sendToBackend} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  twoInput: {
    backgroundColor: "white",
    width: "40%",
    height: 35,

    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: "center",
  },
  oneInput: {
    backgroundColor: "white",
    width: "80%",
    height: 35,

    borderColor: "#e8e8e8",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: "center",
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 14,
    marginTop: 5,
  },
  inputArray: {
    flex: 1,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    marginTop: 5,
  },
  array: {
    fontSize: 15,
  },
  remove: {
    color: "red",
    fontSize: 14,
  },
  dropdownButtonText: {
    marginTop: 10,
    fontSize: 20,
    color: "#007AFF",
  },
  dropdownButton: {
    marginTop: 10,
    alignItems: "center",
  },
  category: {},
  categoryText: {
    fontSize: 16,
    padding: 5,
  },
  selectImage: {
    marginTop: 10,
  },
  uploadButton: {
    marginTop: 10,
  },
  tagInput: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    color: "#333",
  },
});

export default AddPlaceScreen;
