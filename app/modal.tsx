import { Link } from 'expo-router';
import { StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle" size={32} color="#FF6B35" />
          </View>
          <Text style={styles.title}>About Cooking Assistant</Text>
          <Text style={styles.subtitle}>
            Your AI-powered culinary companion powered by Google Gemini
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.featureItem}>
            <Ionicons name="mic" size={20} color="#007AFF" />
            <Text style={styles.featureText}>Voice recognition for hands-free cooking</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="brain" size={20} color="#34C759" />
            <Text style={styles.featureText}>AI-powered recipe suggestions and tips</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="volume-high" size={20} color="#FF9500" />
            <Text style={styles.featureText}>Text-to-speech responses</Text>
          </View>
        </View>

        <Link href="/" dismissTo style={styles.link}>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Ionicons name="home" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    width: '100%',
    marginBottom: 40,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  link: {
    width: '100%',
  },
  button: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
