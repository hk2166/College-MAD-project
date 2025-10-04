import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/AppProvider';
import { Recipe } from '../types';

export default function SavedRecipesList() {
  const { savedRecipes, unsaveRecipe, viewSavedRecipe } = useAppState();

  const handleRemoveRecipe = (recipe: Recipe) => {
    Alert.alert(
      'Remove Recipe',
      `Are you sure you want to remove "${recipe.recipeName}" from your saved recipes?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => unsaveRecipe(recipe.id) },
      ]
    );
  };

  const handleViewRecipe = (recipe: Recipe) => {
    viewSavedRecipe(recipe);
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => handleViewRecipe(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle} numberOfLines={2}>
          {item.recipeName}
        </Text>
        <Text style={styles.recipeDescription} numberOfLines={3}>
          {item.ingredients.split('\n').slice(0, 3).join(', ')}
        </Text>
        <View style={styles.recipeActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewRecipe(item)}
          >
            <Ionicons name="eye-outline" size={20} color="#007AFF" />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleRemoveRecipe(item)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
            <Text style={[styles.actionText, { color: '#ef4444' }]}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (savedRecipes.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="heart-outline" size={64} color="#d1d5db" />
        <Text style={styles.emptyText}>No saved recipes yet</Text>
        <Text style={styles.emptySubtext}>
          Save recipes you love to find them here later!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={savedRecipes}
      renderItem={renderRecipe}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  recipeContent: {
    padding: 16,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  recipeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
  },
});