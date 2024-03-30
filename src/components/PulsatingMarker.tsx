import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface PulsatingMarkerProps {
  coords: Coordinates;
}

export const PulsatingMarker: React.FC<PulsatingMarkerProps> = ({ coords }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Marker coordinate={coords} anchor={{ x: 0.5, y: 0.5 }}>
      <Animated.View
        style={[
          styles.pulse,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
    </Marker>
  );
};

const styles = StyleSheet.create({
  pulse: {
    height: 20,
    width: 20,
    backgroundColor: "rgba(0, 122, 255, 0.5)",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0, 112, 255, 0.3)",
  },
});
