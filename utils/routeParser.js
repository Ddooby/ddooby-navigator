// Directions API 응답 파싱 유틸
// CLAUDE.md: html_instructions 는 UI 렌더 전 태그 제거 필수

/**
 * <b>좌회전</b>해서 ... → "좌회전해서 ..." 처럼 태그만 제거.
 * &nbsp; 같은 엔티티도 공백으로 치환.
 */
export function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<div[^>]*>/gi, '. ')
    .replace(/<\/div>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Google Directions polyline (encoded) → [{latitude, longitude}, ...]
 */
export function decodePolyline(encoded) {
  if (!encoded) return [];
  const points = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dLat;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dLng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
}

/**
 * Directions API route 응답 → 앱이 쓰기 좋은 형태.
 * {
 *   polyline: [{lat,lng}, ...],
 *   steps: [{ instruction, distance, endLocation, polyline: [...] }, ...],
 *   totalDistance: meters,
 *   totalDuration: seconds,
 * }
 */
export function parseRoute(directionsResponse) {
  const route = directionsResponse?.routes?.[0];
  if (!route) return null;

  const leg = route.legs?.[0];
  if (!leg) return null;

  const steps = (leg.steps || []).map((s) => ({
    instruction: stripHtml(s.html_instructions),
    distance: s.distance?.value ?? 0,
    duration: s.duration?.value ?? 0,
    maneuver: s.maneuver || null,
    endLocation: {
      latitude: s.end_location.lat,
      longitude: s.end_location.lng,
    },
    polyline: decodePolyline(s.polyline?.points),
  }));

  return {
    polyline: decodePolyline(route.overview_polyline?.points),
    steps,
    totalDistance: leg.distance?.value ?? 0,
    totalDuration: leg.duration?.value ?? 0,
    startAddress: leg.start_address,
    endAddress: leg.end_address,
  };
}
