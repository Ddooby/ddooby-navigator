// 메인 화면: 지도 전체화면 + 상단 검색바
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchBar from '../components/SearchBar';
import FrogMarker from '../components/FrogMarker';
import useLocation from '../hooks/useLocation';
import { fetchWalkingRoute } from '../services/directionsApi';

export default function MapScreen({ navigation }) {
  const { currentLocation, permissionError, startTracking } = useLocation();
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    startTracking();
  }, [startTracking]);

  const handleSelectPlace = async (place) => {
    if (!currentLocation) {
      setError('현재 위치를 가져오는 중이에요. 잠시 후 다시 시도해주세요.');
      return;
    }
    setError(null);
    setLoadingRoute(true);
    try {
      const destination = {
        latitude: place.latitude,
        longitude: place.longitude,
      };
      const route = await fetchWalkingRoute(currentLocation, destination);
      navigation.navigate('Navigation', {
        route,
        destination,
        destinationName: place.name || place.description,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingRoute(false);
    }
  };

  if (permissionError) {
    return (
      <View style={styles.center}>
        <Text>위치 권한이 필요해요. 설정에서 권한을 허용해주세요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={false}
        followsUserLocation
        initialRegion={
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }
            : undefined
        }
      >
        {currentLocation && <FrogMarker coordinate={currentLocation} />}
      </MapView>

      <SafeAreaView style={styles.searchWrap} pointerEvents="box-none">
        <SearchBar
          currentLocation={currentLocation}
          onSelect={handleSelectPlace}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </SafeAreaView>

      {loadingRoute && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>경로를 찾는 중…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  searchWrap: { position: 'absolute', top: 0, left: 0, right: 0, padding: 12 },
  error: { marginTop: 8, color: '#d33', backgroundColor: '#fff', padding: 8, borderRadius: 6 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: { color: '#fff', marginTop: 12, fontSize: 16 },
});
