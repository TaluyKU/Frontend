import CustomInputText from "#src/components/CustomInputText";
import Colors from "#src/constants/Colors";
import React, { useState, useContext } from "react";
import { StyleSheet, ScrollView, Dimensions } from "react-native";
import {
  Button,
  Checkbox,
  View,
  Dialog,
  PanningProvider,
  Text,
} from "react-native-ui-lib";
import { AuthContext } from "#src/auth/context/AuthContext";

const SignUpScreen = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [policy, setPolicy] = useState<boolean>(false);
  const { register } = useContext(AuthContext);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <View useSafeArea>
        <View style={styles.container}>
          <CustomInputText placeholder={"ชื่อผู้ใช้"} setValue={setName} />
          <CustomInputText placeholder={"อีเมล"} setValue={setEmail} />
          <CustomInputText
            placeholder={"รหัสผ่าน"}
            setValue={setpassword}
            secureTextEntry={true}
          />
          <CustomInputText
            placeholder={"ยืนยันรหัสผ่าน"}
            setValue={setConfirmPassword}
            secureTextEntry={true}
          />
          <Checkbox
            value={policy}
            label={"ข้าพเจ้ายอมรับในข้อตกลงและเงื่อนไข"}
            color={Colors.highlight}
            onValueChange={() => {
              setPolicy(!policy);
            }}
            selectedIcon={require("#assets/images/selected.png")}
            borderRadius={3}
            size={20}
            required
            containerStyle={{ margin: 5, marginTop: 30 }}
          />
          <Button
            label="สมัครสมาชิก"
            backgroundColor={Colors.highlight}
            onPress={() => {
              if (name === "" || email === "" || password === "") {
                console.log("กรุณากรอกข้อมูลให้ครบ");
                setDialogVisible(true);
                setSignUpError("กรุณากรอกข้อมูลให้ครบ");
                return;
              }
              //TODO: Move policy check to backend and save it in the database
              if (!policy) {
                console.log("กรุณายอมรับข้อตกลงและเงื่อนไข");
                setDialogVisible(true);
                setSignUpError("กรุณายอมรับข้อตกลงและเงื่อนไข");
                return;
              }
              register(name, email, password, confirmPassword).catch(
                (error) => {
                  console.log(error);
                  setDialogVisible(true);
                  setSignUpError(error.message);
                }
              );
            }}
            style={{ margin: 5 }}
          ></Button>
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
            <Text>{signUpError}</Text>
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
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    marginTop: Dimensions.get("window").height * 0.1,
    justifyContent: "center",
  },
});

export default SignUpScreen;
