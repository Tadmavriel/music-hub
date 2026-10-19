import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useSpin } from '../hooks/useSpin';

type Props = {
  size?: number;
  color?: string;
  isPlaying?: boolean;
};

export function VinylRecord({ size = 200, color = '#FF2D6F', isPlaying = false }: Props) {
  const spinStyle = useSpin(isPlaying);

  return (
    <Animated.View style={[{ width: size, height: size }, spinStyle]}>
      <View style={[styles.outer, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.ring, { width: size * 0.85, height: size * 0.85, borderRadius: size * 0.425, borderColor: '#3D0A1F' }]} />
        <View style={[styles.ring, { width: size * 0.68, height: size * 0.68, borderRadius: size * 0.34, borderColor: '#5A1030' }]} />
        <View style={[styles.ring, { width: size * 0.52, height: size * 0.52, borderRadius: size * 0.26, borderColor: '#3D0A1F' }]} />

        {/* блик у края: показывает, что пластинка вращается */}
        <View style={[styles.shine, { top: size * 0.05, left: size / 2 - 1.5, height: size * 0.1 }]} />

        <View style={[styles.center, { width: size * 0.34, height: size * 0.34, borderRadius: size * 0.17, backgroundColor: color }]}>
          {/* золотая точка на наклейке */}
          <View style={[styles.dot, { top: size * 0.02, width: size * 0.04, height: size * 0.04, borderRadius: size * 0.02 }]} />
          <View style={[styles.hole, { width: size * 0.06, height: size * 0.06, borderRadius: size * 0.03 }]} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer:  { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A0511', shadowColor: '#FF2D6F', shadowOpacity: 0.6, shadowRadius: 20, elevation: 10 },
  ring:   { position: 'absolute', borderWidth: 1 },
  shine:  { position: 'absolute', width: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)' },
  center: { justifyContent: 'center', alignItems: 'center' },
  dot:    { position: 'absolute', backgroundColor: '#FFD700' },
  hole:   { backgroundColor: '#1A0511' }
});