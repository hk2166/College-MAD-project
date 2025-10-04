import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import PantryManager from '../components/PantryManager';

export default function PantryScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <PantryManager />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});