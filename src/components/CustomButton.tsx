import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface CustomButtonProps {
  onPress: () => void;
  text: string;
  type?: "PRIMARY" | "TERTIARY";
  bgColor?: string;
  fgColor?: string;
}

let CustomButton = ({
  onPress,
  text,
  type,
  bgColor,
  fgColor,
}: CustomButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}` as keyof typeof styles],
        bgColor ? { backgroundColor: bgColor } : {},
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${type}` as keyof typeof styles],
          fgColor ? { color: fgColor } : {},
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    padding: 10,
    marginVertical: 5,

    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#F8F5E8",
  },
  container_PRIMARY: {
    backgroundColor: "#99ff99",
  },
  container_TERTIARY: {},
  text: {
    color: "black",
  },
  text_PRIMARY: {
    fontWeight: "bold",
    fontSize: 12,
  },
  text_TERTIARY: {
    fontSize: 11,
  },
});
export default CustomButton;
