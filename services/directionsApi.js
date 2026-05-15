// Google Directions API 호출
// CLAUDE.md 규칙:
//  - mode=walking 고정 (도보 외 금지)
//  - process.env.GOOGLE_MAPS_API_KEY 만 사용
import { parseRoute } from '../utils/routeParser';

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';

/**
 * 도보 경로 요청.
 * @param {{latitude:number, longitude:number}} origin
 * @param {{latitude:number, longitude:number}} destination
 * @returns {Promise<ReturnType<typeof parseRoute>>}
 */
export async function fetchWalkingRoute(origin, destination) {
  if (!API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY 가 .env 에 설정되지 않았어요.');
  }
  if (!origin || !destination) {
    throw new Error('origin/destination 좌표가 필요합니다.');
  }

  const params = new URLSearchParams({
    origin: `${origin.latitude},${origin.longitude}`,
    destination: `${destination.latitude},${destination.longitude}`,
    mode: 'walking', // ★ 고정 — 절대 다른 값 금지
    language: 'ko',
    key: API_KEY,
  });

  const url = `${BASE_URL}?${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== 'OK') {
    throw new Error(
      `Directions API 오류: ${json.status} ${json.error_message || ''}`
    );
  }

  return parseRoute(json);
}
