import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/AppProvider';
import { Recipe } from '../types';

export default function SavedRecipesList() {
  const { savedRecipes, viewSavedRecipe, unsaveRecipe } = useAppState();
  const navigation = useNavigation();

  const handleViewRecipe = (recipe) => {
    viewSavedRecipe(recipe);
    navigation.navigate('Main', { screen: 'Home' });
  };

  const handleDeleteRecipe = (recipe) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to remove "${recipe.recipeName}" from your saved recipes?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => unsaveRecipe(recipe.id),
        },
      ]
    );
  };

  if (savedRecipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>You haven't saved any recipes yet.</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('Main', { screen: 'Home' })}
        >
          <Text style={styles.emptyButtonText}>Find a recipe to cook</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={savedRecipes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleViewRecipe(item)}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {item.recipeName}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteRecipe(item)}
          >
            <Ionicons name="trash-outline" size={24} color="#ff3b30" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
});
