import React from 'react';
import { View, StyleSheet } from 'react-native';

export function VinylRecord({ size = 200, color = '#FF2D6F' }: { size?: number; color?: string }) {
  return (
    <View style={[styles.outer, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.ring, { width: size * 0.85, height: size * 0.85, borderRadius: size * 0.425, borderColor: '#3D0A1F' }]} />
      <View style={[styles.ring, { width: size * 0.68, height: size * 0.68, borderRadius: size * 0.34, borderColor: '#5A1030' }]} />
      <View style={[styles.ring, { width: size * 0.52, height: size * 0.52, borderRadius: size * 0.26, borderColor: '#3D0A1F' }]} />
      <View style={[styles.center, { width: size * 0.34, height: size * 0.34, borderRadius: size * 0.17, backgroundColor: color }]}>
        <View style={[styles.hole, { width: size * 0.06, height: size * 0.06, borderRadius: size * 0.03 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer:  { justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A0511', shadowColor: '#FF2D6F', shadowOpacity: 0.6, shadowRadius: 20, elevation: 10 },
  ring:   { position: 'absolute', borderWidth: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
  hole:   { backgroundColor: '#1A0511' }
});