// Lottie 애니메이션 래퍼
// CLAUDE.md: 모든 Lottie JSON 은 assets/lottie/ 로컬에서 require — 외부 URL fetch 금지
//
// Phase 2 진입 시점에 아래 require 들을 활성화:
//   const SOURCES = {
//     jump:    require('../assets/lottie/frog_jump.json'),
//     loading: require('../assets/lottie/frog_loading.json'),
//     arrive:  require('../assets/lottie/frog_arrive.json'),
//   };
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// import LottieView from 'lottie-react-native';

const PLACEHOLDER_EMOJI = {
  jump: '🐸',
  loading: '⌛',
  arrive: '🎉',
};

export default function FrogAnimation({ type = 'jump', size = 120, loop = true }) {
  // Phase 1: Lottie 에셋 추가 전까지 이모지 플레이스홀더
  // Phase 2: 아래로 교체
  //   return (
  //     <LottieView
  //       source={SOURCES[type]}
  //       autoPlay
  //       loop={loop}
  //       style={{ width: size, height: size }}
  //     />
  //   );
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.6 }}>
        {PLACEHOLDER_EMOJI[type] || '🐸'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
