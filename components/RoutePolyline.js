// 지도에 도보 경로 선 표시
import React from 'react';
import { Polyline } from 'react-native-maps';

export default function RoutePolyline({ coords, color = '#2a7d2a', width = 6 }) {
  if (!coords || coords.length < 2) return null;
  return (
    <Polyline
      coordinates={coords}
      strokeColor={color}
      strokeWidth={width}
      lineCap="round"
      lineJoin="round"
    />
  );
}
