import * as React from "react";
import { Text, View, StyleSheet, StyleProp, ViewStyle } from "react-native";

type Props = {
  isActive: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Shape(props: Props) {
  return (
    <View
      style={[styles.shape, props.isActive && styles.active, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  shape: {
    width: 100,
    height: 100,
    backgroundColor: "#00D9FF",
    borderRadius: 50,
  },
  active: {
    backgroundColor: "#198CFF",
  },
});
