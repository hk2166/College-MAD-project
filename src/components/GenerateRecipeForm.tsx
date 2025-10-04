import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/AppProvider';

export default function GenerateRecipeForm() {
  const { pantryItems, setCurrentRecipe } = useAppState();
  const [ingredients, setIngredients] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [cuisinePreferences, setCuisinePreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const defaultIngredients = pantryItems.map((item) => item.name).join(', ');
    setIngredients(defaultIngredients);
  }, [pantryItems]);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      Alert.alert('Error', 'Please list at least one ingredient.');
      return;
    }

    setIsLoading(true);
    setCurrentRecipe(null);

    try {
      // Simulate API call - in a real app, you'd call your AI service here
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock recipe data
      const mockRecipe = {
        id: Math.random().toString(36).substr(2, 9),
        recipeName: 'Delicious Pasta with Fresh Ingredients',
        ingredients: `• 2 cups pasta\n• 1 cup tomatoes\n• 1/2 cup cheese\n• 2 tbsp olive oil\n• Salt and pepper to taste`,
        instructions: `1. Boil water and cook pasta according to package instructions\n2. Heat olive oil in a pan\n3. Add tomatoes and cook for 5 minutes\n4. Add cooked pasta and mix well\n5. Season with salt and pepper\n6. Serve hot with cheese on top`,
        nutritionalInformation: 'Calories: 350, Protein: 12g, Carbs: 45g, Fat: 8g',
        imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400',
        imageHint: 'Delicious pasta dish with tomatoes and cheese',
      };

      setCurrentRecipe(mockRecipe);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      Alert.alert('Error', 'There was an issue creating your recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Generate a Recipe</Text>
        <Text style={styles.description}>Tell us what you have, and we'll create a dish for you.</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Available Ingredients</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={ingredients}
            onChangeText={setIngredients}
            placeholder="e.g., chicken breast, tomatoes, rice"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={styles.helpText}>
            List ingredients you have, separated by commas. Your pantry items are added automatically.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dietary Restrictions (Optional)</Text>
          <TextInput
            style={styles.input}
            value={dietaryRestrictions}
            onChangeText={setDietaryRestrictions}
            placeholder="e.g., vegetarian, gluten-free"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cuisine Preferences (Optional)</Text>
          <TextInput
            style={styles.input}
            value={cuisinePreferences}
            onChangeText={setCuisinePreferences}
            placeholder="e.g., Italian, Mexican"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={generateRecipe}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text style={styles.buttonText}>Generate Recipe</Text>
              <Ionicons name="sparkles" size={20} color="white" style={styles.buttonIcon} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 100,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 4,
  },
});