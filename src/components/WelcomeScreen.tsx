import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="restaurant" size={48} color="#007AFF" />
      </View>
      <Text style={styles.title}>Welcome to Culinary Copilot</Text>
      <Text style={styles.subtitle}>
        Tell us what ingredients you have, and we'll create a delicious recipe for you!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
});