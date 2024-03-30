import { View, TextField, Icon, Avatar } from "react-native-ui-lib";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { NavigationProp } from "@react-navigation/native";
import Colors from "#src/constants/Colors";

interface TopBarProps {
  navigation: NavigationProp<any>;
}

const TopBar = ({ navigation }: TopBarProps) => {
  const [searchText, setSearchText] = useState<string>("");
  return (
    <View style={styles.container} useSafeArea>
      <View style={styles.searchBox}>
        <Icon
          source={require("#assets/images/search.png")}
          size={16}
          margin-9
        />
        <TextField
          onChangeText={setSearchText}
          containerStyle={{
            flex: 1,
            height: "100%",
            justifyContent: "center",
          }}
        />
      </View>
      <Avatar
        source={require("#assets/images/app-icon.png")}
        size={40}
        onPress={() => {
          navigation.navigate("Profile");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    zIndex: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 31,
    backgroundColor: Colors.background,
    borderWidth: 0.2,
    borderColor: Colors.highlight,
    borderRadius: 10,
  },
});

export default TopBar;
