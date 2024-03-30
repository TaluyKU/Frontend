import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { TextField, View, Image, TouchableOpacity } from "react-native-ui-lib";
import Colors from "#src/constants/Colors";

interface CustomInputTextProps {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  secureTextEntry?: boolean;
}
const CustomInputText = ({
  setValue,
  placeholder,
  secureTextEntry = false,
}: CustomInputTextProps) => {
  const [securePassword, setSecurePassword] = useState<boolean>(true);

  return (
    <View style={styles.container} useSafeArea>
      <TextField
        autoCapitalize="none"
        onChangeText={setValue}
        placeholder={placeholder}
        containerStyle={styles.input}
        secureTextEntry={secureTextEntry && securePassword}
        placeholderTextColor={Colors.highlight}
      />
      {secureTextEntry ? (
        <TouchableOpacity
          onPress={() => {
            setSecurePassword(!securePassword);
          }}
          style={{ position: "absolute", right: 10 }}
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={
              securePassword
                ? require("#assets/images/eye-view.png")
                : require("#assets/images/eye-hide.png")
            }
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: 50,

    borderColor: Colors.highlight,
    borderRadius: 10,
    marginVertical: 5,
    justifyContent: "center",
  },
  input: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
});

export default CustomInputText;
