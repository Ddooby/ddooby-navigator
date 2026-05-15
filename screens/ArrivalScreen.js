// 도착 세레모니 화면 (Phase 2: 청개구리 애니메이션 추가 예정)
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FrogAnimation from '../components/FrogAnimation';

export default function ArrivalScreen({ navigation, route }) {
  const { destinationName } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.celebrationBox}>
        {/* Phase 2: assets/lottie/frog_arrive.json 적용 예정 */}
        <FrogAnimation type="arrive" size={200} />
        <Text style={styles.title}>도착했어요!</Text>
        {destinationName ? (
          <Text style={styles.subtitle}>{destinationName}</Text>
        ) : null}
      </View>

      <Pressable
        style={styles.button}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.buttonText}>홈으로</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fff6',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  celebrationBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#2a7d2a', marginTop: 16 },
  subtitle: { fontSize: 16, color: '#444', marginTop: 8 },
  button: {
    backgroundColor: '#2a7d2a',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
