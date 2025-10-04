import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SavedRecipesList from '../components/SavedRecipesList';

export default function SavedRecipesScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <SavedRecipesList />
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