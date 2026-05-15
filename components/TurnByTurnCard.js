// 하단 턴바이턴 안내 카드
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { formatDistance } from '../utils/distance';

export default function TurnByTurnCard({
  step,
  distanceToNextStep,
  distanceToDestination,
  destinationName,
  recalculating,
}) {
  if (!step) return null;

  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <View style={styles.card}>
        {recalculating && (
          <View style={styles.recalcChip}>
            <Text style={styles.recalcText}>경로 다시 찾는 중…</Text>
          </View>
        )}
        <Text style={styles.distance}>
          {Number.isFinite(distanceToNextStep)
            ? formatDistance(distanceToNextStep)
            : ''}
        </Text>
        <Text style={styles.instruction} numberOfLines={2}>
          {step.instruction}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.dest} numberOfLines={1}>
          🐸 {destinationName || '목적지'}까지{' '}
          {Number.isFinite(distanceToDestination)
            ? formatDistance(distanceToDestination)
            : ''}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  card: {
    margin: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  recalcChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  recalcText: { color: '#8a6d00', fontSize: 12 },
  distance: { fontSize: 22, fontWeight: '700', color: '#2a7d2a' },
  instruction: { fontSize: 16, color: '#222', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  dest: { fontSize: 13, color: '#666' },
});
