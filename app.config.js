// .env 로딩 (빌드 시점에 process.env 에 주입)
require('dotenv').config();

module.exports = {
  expo: {
    name: '뚜비',
    slug: 'ddooby-navigator',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    // Android only (초기 버전)
    android: {
      package: 'com.ddooby.navigator',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
      ],
      config: {
        googleMaps: {
          // 절대 하드코딩 금지 — process.env 만 사용
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    plugins: [
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            '뚜비가 길 안내를 위해 현재 위치를 사용해요.',
        },
      ],
    ],
  },
};
