import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppState } from '../context/AppProvider';
import { generateRecipeFromIngredients } from '../ai/flows/generate-recipe-from-ingredients';
import { PlaceHolderImages } from '../lib/placeholder-images';

export default function GenerateRecipeForm() {
  const { pantryItems, setCurrentRecipe } = useAppState();
  const [ingredients, setIngredients] = useState(
    pantryItems.map((item) => item.name).join(', ')
  );
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [cuisinePreferences, setCuisinePreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!ingredients.trim()) {
      Alert.alert('Missing Ingredients', 'Please enter at least one ingredient.');
      return;
    }

    setIsLoading(true);
    setCurrentRecipe(null);

    try {
      const result = await generateRecipeFromIngredients({
        ingredients,
        dietaryRestrictions,
        cuisinePreferences,
      });

      // Select a random recipe placeholder image
      const recipeImages = PlaceHolderImages.filter((img) => img.id.startsWith('recipe-'));
      const randomImage = recipeImages[Math.floor(Math.random() * recipeImages.length)];

      setCurrentRecipe({
        ...result,
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: randomImage.imageUrl,
        imageHint: randomImage.imageHint,
      });
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      Alert.alert(
        'Error',
        'Failed to generate recipe. Please check your API key and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate a Recipe</Text>
      <Text style={styles.subtitle}>
        Tell us what you have, and we'll create a dish for you.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Available Ingredients</Text>
        <TextInput
          style={styles.textArea}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="e.g., chicken breast, tomatoes, rice"
          multiline
          numberOfLines={4}
        />
        <Text style={styles.description}>
          List ingredients you have, separated by commas. Your pantry items are added automatically.
        </Text>

        <Text style={styles.label}>Dietary Restrictions (Optional)</Text>
        <TextInput
          style={styles.input}
          value={dietaryRestrictions}
          onChangeText={setDietaryRestrictions}
          placeholder="e.g., vegetarian, gluten-free"
        />

        <Text style={styles.label}>Cuisine Preferences (Optional)</Text>
        <TextInput
          style={styles.input}
          value={cuisinePreferences}
          onChangeText={setCuisinePreferences}
          placeholder="e.g., Italian, Mexican"
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Recipe</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  description: {
    fontSize: 12,
    color: '#888',
    marginTop: -8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
