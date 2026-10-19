import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSpin } from '../hooks/useSpin';

type Props = {
  size?: number;
  color?: string;
  isPlaying?: boolean;
};

export function VinylRecord({ size = 200, color = '#FF4D8D', isPlaying = false }: Props) {
  const spinStyle = useSpin(isPlaying);

  return (
    <Animated.View style={[{ width: size, height: size }, spinStyle]}>
      <View style={[styles.outer, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.ring, { width: size * 0.85, height: size * 0.85, borderRadius: size * 0.425, borderColor: '#2A1822' }]} />
        <View style={[styles.ring, { width: size * 0.68, height: size * 0.68, borderRadius: size * 0.34, borderColor: '#3A2430' }]} />
        <View style={[styles.ring, { width: size * 0.52, height: size * 0.52, borderRadius: size * 0.26, borderColor: '#2A1822' }]} />

        <View style={[styles.shine, { top: size * 0.05, left: size / 2 - 1.5, height: size * 0.1 }]} />

        <View style={[styles.center, { width: size * 0.34, height: size * 0.34, borderRadius: size * 0.17, backgroundColor: color }]}>
          <View style={[styles.dot, { top: size * 0.02, width: size * 0.04, height: size * 0.04, borderRadius: size * 0.02 }]} />
          <View style={[styles.hole, { width: size * 0.06, height: size * 0.06, borderRadius: size * 0.03 }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer:  { justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D0609', shadowColor: '#FF4D8D', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  ring:   { position: 'absolute', borderWidth: 1 },
  shine:  { position: 'absolute', width: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  center: { justifyContent: 'center', alignItems: 'center' },
  dot:    { position: 'absolute', backgroundColor: '#F5C451' },
  hole:   { backgroundColor: '#0D0609' }
});