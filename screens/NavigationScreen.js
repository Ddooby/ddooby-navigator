// 턴바이턴 안내 화면
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import RoutePolyline from '../components/RoutePolyline';
import FrogMarker from '../components/FrogMarker';
import TurnByTurnCard from '../components/TurnByTurnCard';
import useLocation from '../hooks/useLocation';
import useNavigationFlow from '../hooks/useNavigation';
import { fetchWalkingRoute } from '../services/directionsApi';

export default function NavigationScreen({ navigation, route: navRoute }) {
  const {
    route: initialRoute,
    destination,
    destinationName,
  } = navRoute.params || {};

  const { currentLocation, startTracking, stopTracking } = useLocation();
  const [route, setRoute] = useState(initialRoute);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    startTracking();
    return () => stopTracking();
  }, [startTracking, stopTracking]);

  // 경로 이탈 시 재계산 (CLAUDE.md: 30m 초과)
  const handleDeviate = useCallback(async () => {
    if (recalculating || !currentLocation) return;
    setRecalculating(true);
    try {
      const newRoute = await fetchWalkingRoute(currentLocation, destination);
      setRoute(newRoute);
    } catch (e) {
      // 일시적 실패: 다음 위치 업데이트 때 다시 시도
      console.warn('경로 재계산 실패:', e.message);
    } finally {
      setRecalculating(false);
    }
  }, [currentLocation, destination, recalculating]);

  // 도착 감지 → ArrivalScreen
  const handleArrive = useCallback(() => {
    navigation.replace('Arrival', { destinationName });
  }, [navigation, destinationName]);

  const { currentStep, distanceToNextStep, distanceToDestination } =
    useNavigationFlow({
      currentLocation,
      route,
      destination,
      onDeviate: handleDeviate,
      onArrive: handleArrive,
    });

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
                latitudeDelta: 0.003,
                longitudeDelta: 0.003,
              }
            : undefined
        }
      >
        {route?.polyline && <RoutePolyline coords={route.polyline} />}
        {currentLocation && <FrogMarker coordinate={currentLocation} />}
      </MapView>

      <TurnByTurnCard
        step={currentStep}
        distanceToNextStep={distanceToNextStep}
        distanceToDestination={distanceToDestination}
        destinationName={destinationName}
        recalculating={recalculating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
