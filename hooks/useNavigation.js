// 턴바이턴 + 경로 이탈 감지 훅
// CLAUDE.md 임계값:
//  - 경로 이탈: 30m 초과
//  - 다음 안내 전환: 20m 이내
//  - 도착 감지: 15m 이내
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  haversineDistance,
  distanceToPolyline,
} from '../utils/distance';

const DEVIATION_THRESHOLD_M = 30;
const NEXT_STEP_THRESHOLD_M = 20;
const ARRIVAL_THRESHOLD_M = 15;

/**
 * @param {object} params
 * @param {{latitude:number, longitude:number}} params.currentLocation
 * @param {object} params.route        - parseRoute() 결과
 * @param {{latitude:number, longitude:number}} params.destination
 * @param {() => void} params.onDeviate
 * @param {() => void} params.onArrive
 */
export default function useNavigationFlow({
  currentLocation,
  route,
  destination,
  onDeviate,
  onArrive,
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);

  const currentStep = useMemo(() => {
    if (!route?.steps?.length) return null;
    return route.steps[Math.min(stepIndex, route.steps.length - 1)];
  }, [route, stepIndex]);

  // 다음 step 까지 거리
  const distanceToNextStep = useMemo(() => {
    if (!currentLocation || !currentStep) return Infinity;
    return haversineDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      currentStep.endLocation.latitude,
      currentStep.endLocation.longitude
    );
  }, [currentLocation, currentStep]);

  // 목적지 까지 거리
  const distanceToDestination = useMemo(() => {
    if (!currentLocation || !destination) return Infinity;
    return haversineDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      destination.latitude,
      destination.longitude
    );
  }, [currentLocation, destination]);

  // 경로 이탈 여부
  useEffect(() => {
    if (!currentLocation || !route?.polyline) return;
    const d = distanceToPolyline(currentLocation, route.polyline);
    if (d > DEVIATION_THRESHOLD_M) {
      onDeviate && onDeviate();
    }
  }, [currentLocation, route, onDeviate]);

  // 다음 step 전환 (20m 이내)
  useEffect(() => {
    if (distanceToNextStep <= NEXT_STEP_THRESHOLD_M && route?.steps) {
      setStepIndex((prev) =>
        Math.min(prev + 1, route.steps.length - 1)
      );
    }
  }, [distanceToNextStep, route]);

  // 도착 감지 (15m 이내)
  useEffect(() => {
    if (!hasArrived && distanceToDestination <= ARRIVAL_THRESHOLD_M) {
      setHasArrived(true);
      onArrive && onArrive();
    }
  }, [distanceToDestination, hasArrived, onArrive]);

  const reset = useCallback(() => {
    setStepIndex(0);
    setHasArrived(false);
  }, []);

  return {
    currentStep,
    stepIndex,
    distanceToNextStep,
    distanceToDestination,
    hasArrived,
    reset,
  };
}

export {
  DEVIATION_THRESHOLD_M,
  NEXT_STEP_THRESHOLD_M,
  ARRIVAL_THRESHOLD_M,
};
