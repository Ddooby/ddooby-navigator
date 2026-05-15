// 청개구리 현재 위치 마커
// Phase 1: 이모지 마커 / Phase 2: Lottie 애니메이션 교체 예정
import React from 'react';
import { Marker } from 'react-native-maps';
import { View, Text, StyleSheet } from 'react-native';

export default function FrogMarker({ coordinate }) {
  if (!coordinate) return null;
  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={styles.wrap}>
        <Text style={styles.frog}>🐸</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
    borderRadius: 999,
    padding: 4,
    borderWidth: 2,
    borderColor: '#2a7d2a',
  },
  frog: { fontSize: 22 },
});
