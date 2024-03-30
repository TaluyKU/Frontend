import React, { useContext, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import CustomInputText from "#src/components/CustomInputText";
import { AuthContext } from "#src/auth/context/AuthContext";
import { NavigationProp } from "@react-navigation/native";
import {
  View,
  Button,
  Dialog,
  Text,
  PanningProvider,
  Image,
} from "react-native-ui-lib";
import Colors from "#src/constants/Colors";

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

//TODO: check email format before login
const SignInScreen = ({ navigation }: HomeScreenProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useContext(AuthContext);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View useSafeArea>
        <View style={styles.background}>
          <Image
            style={styles.logo}
            source={require("#assets/images/app-icon.png")}
          />
          <CustomInputText placeholder={"อีเมล"} setValue={setEmail} />
          <CustomInputText
            placeholder={"รหัสผ่าน"}
            setValue={setPassword}
            secureTextEntry={true}
          />
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <Button
              label="ลืมรหัสผ่าน"
              link
              linkColor={Colors.highlight}
              size={Button.sizes.small}
              onPress={forgetPasswordHandle}
            ></Button>
          </View>
          <View style={{ marginTop: 20 }}>
            <Button
              onPress={() => {
                if (email === "" || password === "") {
                  setDialogVisible(true);
                  setLoginError("กรุณากรอกอีเมลและรหัสผ่าน");
                  return;
                }
                login(email, password).catch((error: any) => {
                  setDialogVisible(true);
                  setLoginError(error.message);
                });
              }}
              label="เข้าสู่ระบบ"
              style={{ backgroundColor: Colors.highlight }}
            ></Button>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text>ยังไม่มีบัญชีผู้ใช้งาน?</Text>
            <View style={{ width: 10 }}></View>
            <Button
              onPress={() => {
                navigation.navigate("SignUp");
              }}
              link
              label="สร้างบัญชี"
              size={Button.sizes.xSmall}
              linkColor={Colors.highlight}
            />
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
            <Text text60>{loginError}</Text>
          </Dialog>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.background,
  },
  background: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    margin: 50,
  },
});

const forgetPasswordHandle = () => {};

export default SignInScreen;
