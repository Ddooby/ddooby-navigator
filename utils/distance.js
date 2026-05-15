// Ddooby-tracker 에서 그대로 재사용 (CLAUDE.md: 외부 라이브러리 교체 금지)
const EARTH_RADIUS_M = 6371000;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateTotalDistance(coords) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineDistance(
      coords[i - 1].latitude,
      coords[i - 1].longitude,
      coords[i].latitude,
      coords[i].longitude
    );
  }
  return total;
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(2)}km`;
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

/**
 * 점(lat,lon) 에서 선분(A-B) 까지의 최단 거리 (m).
 * 경로 이탈 감지(useNavigation)에서 사용.
 */
export function distanceToSegment(point, a, b) {
  // 평면 근사: 작은 거리(<수 km)에서는 충분히 정확
  const toMeters = (lat, lon) => {
    const x = toRad(lon) * Math.cos(toRad((a.latitude + b.latitude) / 2)) * EARTH_RADIUS_M;
    const y = toRad(lat) * EARTH_RADIUS_M;
    return { x, y };
  };

  const p = toMeters(point.latitude, point.longitude);
  const pa = toMeters(a.latitude, a.longitude);
  const pb = toMeters(b.latitude, b.longitude);

  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    // A == B 인 경우 점-점 거리
    return haversineDistance(point.latitude, point.longitude, a.latitude, a.longitude);
  }

  // 선분 위 가장 가까운 점의 매개변수 t (0~1 로 클램프)
  let t = ((p.x - pa.x) * dx + (p.y - pa.y) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));

  const closestX = pa.x + t * dx;
  const closestY = pa.y + t * dy;
  return Math.hypot(p.x - closestX, p.y - closestY);
}

/**
 * 폴리라인(coords[]) 까지의 최단 거리.
 * 경로 이탈 30m 임계값 판단에 사용.
 */
export function distanceToPolyline(point, polyline) {
  if (!polyline || polyline.length < 2) return Infinity;
  let min = Infinity;
  for (let i = 1; i < polyline.length; i++) {
    const d = distanceToSegment(point, polyline[i - 1], polyline[i]);
    if (d < min) min = d;
  }
  return min;
}
