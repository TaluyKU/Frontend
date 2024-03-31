import { StyleSheet } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import {
  Avatar,
  Text,
  View,
  TouchableOpacity,
  Icon,
  Dialog,
  PanningProvider,
  TextField,
  Button,
} from 'react-native-ui-lib';
import { AuthContext } from '#src/auth/context/AuthContext';
import Colors from '#src/constants/Colors';
import axios from 'axios';
import { UserInfoProps } from '#src/interfaces/UserInfoInterface';
import * as ImagePicker from 'expo-image-picker';

//TODO: Edit Profile
//TODO: Upload Profile Picture
//FIXME: Text out of box when too long
//TODO: Have Problem with big image size and have big load time
//TODO: Do lazy Load for image

const ProfileScreen = () => {
  const [user, setUser] = useState<UserInfoProps>({
    avatar: '',
    email: '',
    id: '',
    name: '',
    phone: '',
  });
  const { logout, userToken } = useContext(AuthContext);
  const [editProfile, setEditProfile] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string>('');
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>('');
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');
  const [isEditAvatar, setIsEditAvatar] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const getUserInfo = async () => {
    await axios
      .get(`${process.env.BASE_URL}/auth/get-user-info`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setName(response.data.name);
        setPhone(response.data.phone);
      })
      .catch((error) => {
        setDialogMessage(error.response.data.message);
        setDialogVisible(true);
      });
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('กรุณาอนุญาตการเข้าถึงรูปภาพ');
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled) {
        setSelectedImageUri(result.assets[0].uri);
        setSelectedImageBase64(result.assets[0].base64 ?? null);
      }
    }
  };

  // FIXME: Try use skip type checking for form data when use image URI
  const handleUploadAvatar = async () => {
    if (!selectedImageBase64) {
      console.log('No image selected for upload.');
      return;
    }
    setIsEditAvatar(false);

    // FormData to hold the image data
    const payload = {
      imageBase64: `${selectedImageBase64}`,
    };

    // Config for the Axios POST request, including headers
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };

    await axios
      .post(`${process.env.BASE_URL}/upload/profile`, payload, config)
      .then((response) => {
        console.log('Upload successful:', response.data);
        getUserInfo();
        setSelectedImageBase64(null);
        setSelectedImageUri('');
      })
      .catch((response) => {
        console.error('Upload error:', response);
        alert('Upload failed. Please try again.');
      });
  };

  const saveUserInfo = async () => {
    await axios
      .post(
        `${process.env.BASE_URL}/auth/update-user-info`,
        {
          name: user.name,
          phone: user.phone,
          avatar: user.avatar,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((response) => {
        getUserInfo();
        setEditProfile(false);
      })
      .catch((error) => {
        setDialogMessage(error.response.data.message);
        getUserInfo();
        setDialogVisible(true);
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }} useSafeArea>
      <View style={styles.container}>
        <Avatar
          source={
            user.avatar != ''
              ? { uri: `${process.env.PROFILE_BUCKET_BASE_URL}/${user.avatar}` }
              : require('#assets/images/avatar-default.png')
          }
          size={140}
          containerStyle={styles.avatar}
          onPress={() => {
            setIsEditAvatar(true);
          }}
        />
        <Dialog
          visible={isEditAvatar}
          onDismiss={() => setIsEditAvatar(false)}
          containerStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 8,
            padding: 20,
            alignItems: 'center',
          }}
        >
          <Avatar
            source={{ uri: selectedImageUri }}
            size={100}
            onPress={() => handlePickAvatar()}
            containerStyle={{ margin: 20 }}
          />
          <Button
            label="บันทึก"
            backgroundColor={Colors.highlight}
            onPress={() => {
              handleUploadAvatar();
            }}
          ></Button>
        </Dialog>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text>ประวัติส่วนตัว</Text>
          {editProfile ? (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                saveUserInfo();
              }}
            >
              <Text>บันทึก</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                setEditProfile(!editProfile);
              }}
            >
              <Icon
                source={require('#assets/images/edit-text.png')}
                size={15}
                style={{ marginRight: 4 }}
              />
              <Text>แก้ไข</Text>
            </TouchableOpacity>
          )}
        </View>

        {editProfile ? (
          <View style={{ ...styles.boxContainer, height: '21%' }}>
            <View style={{ ...styles.profileInfo, borderBottomWidth: 1 }}>
              <View style={styles.iconLabelContainer}>
                <Icon
                  source={require('#assets/images/name-icon.png')}
                  size={20}
                  style={styles.icon}
                />
                <Text>ชื่อ</Text>
              </View>
              <TextField
                containerStyle={styles.textFieldContainer}
                fieldStyle={styles.textFields}
                value={user.name}
                enableErrors={true}
                validationMessagePosition="top"
                onChangeText={(text) => setUser({ ...user, name: text })}
              />
            </View>
            <View style={{ ...styles.profileInfo, borderBottomWidth: 1 }}>
              <View style={styles.iconLabelContainer}>
                <Icon
                  source={require('#assets/images/telephone.png')}
                  size={20}
                  style={styles.icon}
                />
                <Text>เบอร์โทร</Text>
              </View>
              <TextField
                containerStyle={styles.textFieldContainer}
                fieldStyle={styles.textFields}
                value={user.phone}
                inputMode="numeric"
                enableErrors={true}
                validate={['number', (value: string) => value.length == 10]}
                validateOnChange={true}
                validationMessage={['กรุณากรอกตัวเลขเท่านั้น', 'กรุณากรอกเบอร์โทร 10 หลัก']}
                validationMessagePosition="top"
                onChangeText={(text) => setUser({ ...user, phone: text })}
              />
            </View>
            <View style={{ ...styles.profileInfo, borderBottomWidth: 0 }}>
              <View style={styles.iconLabelContainer}>
                <Icon source={require('#assets/images/email.png')} size={20} style={styles.icon} />
                <Text>อีเมล</Text>
              </View>
              <Text>{user.email}</Text>
            </View>
          </View>
        ) : (
          <View style={{ ...styles.boxContainer, height: '21%' }}>
            <View style={{ ...styles.profileInfo, borderBottomWidth: 1 }}>
              <View style={styles.iconLabelContainer}>
                <Icon
                  source={require('#assets/images/name-icon.png')}
                  size={20}
                  style={styles.icon}
                />
                <Text>ชื่อ</Text>
              </View>
              <Text>{user.name}</Text>
            </View>
            <View style={{ ...styles.profileInfo, borderBottomWidth: 1 }}>
              <View style={styles.iconLabelContainer}>
                <Icon
                  source={require('#assets/images/telephone.png')}
                  size={20}
                  style={styles.icon}
                />
                <Text>เบอร์โทร</Text>
              </View>
              <Text>{user.phone}</Text>
            </View>
            <View style={{ ...styles.profileInfo, borderBottomWidth: 0 }}>
              <View style={styles.iconLabelContainer}>
                <Icon source={require('#assets/images/email.png')} size={20} style={styles.icon} />
                <Text>ชื่อผู้ใช้</Text>
              </View>
              <Text>{user.email}</Text>
            </View>
          </View>
        )}

        <Text style={{ width: '100%', marginTop: 10 }}>อื่นๆ</Text>

        <View style={{ ...styles.boxContainer, height: '7%' }}>
          {/* <TouchableOpacity
            style={{ ...styles.profileInfo, borderBottomWidth: 1 }}
          >
            <View style={styles.iconLabelContainer}>
              <Icon
                source={require("#assets/images/assistant.png")}
                size={20}
                style={styles.icon}
              ></Icon>
              <Text>รายงานปัญหาและข้อเสนอแนะ</Text>
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.profileInfo}
            onPress={() => {
              logout();
            }}
          >
            <View style={styles.iconLabelContainer}>
              <Icon
                source={require('#assets/images/logout.png')}
                size={20}
                style={styles.icon}
              ></Icon>
              <Text>ออกจากระบบ</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          panDirection={PanningProvider.Directions.RIGHT}
          containerStyle={{
            backgroundColor: Colors.primary,
            borderRadius: 10,
            padding: 20,
          }}
        >
          <Text text60>{dialogMessage}</Text>
        </Dialog>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    margin: 20,
  },
  boxContainer: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'space-around',
    margin: 10,
    height: '7%',
  },
  profileInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    borderColor: Colors.background,
  },
  iconLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  textFields: {
    width: '100%',
    height: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.highlight,
  },
  textFieldContainer: {
    width: '60%',
    padding: 5,
  },
});

export default ProfileScreen;
