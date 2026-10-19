import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const ONE_TURN_MS = 4000; // один оборот за 4 секунды

export function useSpin(isPlaying: boolean) {
  const angle = useRef(new Animated.Value(0)).current;
  const currentAngle = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      const from = currentAngle.current % 360;
      angle.setValue(from);
      const loop = Animated.loop(
        Animated.timing(angle, {
          toValue: from + 360,
          duration: ONE_TURN_MS,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      loop.start();
      return () => {
        loop.stop();
        angle.stopAnimation((value) => {
          currentAngle.current = value;
        });
      };
    }
  }, [isPlaying, angle]);

  const rotate = angle.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return { transform: [{ rotate }] };
}