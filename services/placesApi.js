// Google Places API 호출
// CLAUDE.md 규칙:
//  - language=ko 필수
//  - process.env.GOOGLE_MAPS_API_KEY 만 사용
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const AUTOCOMPLETE_URL =
  'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const DETAILS_URL =
  'https://maps.googleapis.com/maps/api/place/details/json';

/**
 * 자동완성 검색.
 * @param {string} query
 * @param {{latitude:number, longitude:number}} [location]  - 결과 가중치용
 * @returns {Promise<Array<{ placeId:string, mainText:string, secondaryText:string, description:string }>>}
 */
export async function searchPlaces(query, location) {
  if (!API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY 가 .env 에 설정되지 않았어요.');
  }
  if (!query || !query.trim()) return [];

  const params = new URLSearchParams({
    input: query,
    language: 'ko', // ★ 고정 — 한국어 결과 보장
    key: API_KEY,
  });

  if (location) {
    params.append('location', `${location.latitude},${location.longitude}`);
    params.append('radius', '20000'); // 20km 가중치
  }

  const url = `${AUTOCOMPLETE_URL}?${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    throw new Error(
      `Places Autocomplete 오류: ${json.status} ${json.error_message || ''}`
    );
  }

  return (json.predictions || []).map((p) => ({
    placeId: p.place_id,
    mainText: p.structured_formatting?.main_text || p.description,
    secondaryText: p.structured_formatting?.secondary_text || '',
    description: p.description,
  }));
}

/**
 * placeId → 좌표 + 이름 조회.
 * @param {string} placeId
 * @returns {Promise<{ latitude:number, longitude:number, name:string, address:string }>}
 */
export async function getPlaceDetails(placeId) {
  if (!API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY 가 .env 에 설정되지 않았어요.');
  }

  const params = new URLSearchParams({
    place_id: placeId,
    language: 'ko',
    fields: 'name,formatted_address,geometry/location',
    key: API_KEY,
  });

  const url = `${DETAILS_URL}?${params.toString()}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== 'OK') {
    throw new Error(
      `Places Details 오류: ${json.status} ${json.error_message || ''}`
    );
  }

  const loc = json.result?.geometry?.location;
  return {
    latitude: loc.lat,
    longitude: loc.lng,
    name: json.result?.name || '',
    address: json.result?.formatted_address || '',
  };
}
