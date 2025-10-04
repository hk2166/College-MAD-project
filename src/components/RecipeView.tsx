import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/AppProvider';
import { Recipe } from '../types';

interface RecipeViewProps {
  recipe: Recipe;
  onBack?: () => void;
}

export default function RecipeView({ recipe, onBack }: RecipeViewProps) {
  const { isRecipeSaved, saveRecipe, unsaveRecipe } = useAppState();
  const [currentStep, setCurrentStep] = useState(0);

  const isSaved = isRecipeSaved(recipe.id);
  const ingredients = recipe.ingredients.split('\n').filter(item => item.trim());
  const instructions = recipe.instructions.split('\n').filter(item => item.trim());
  const nutrition = recipe.nutritionalInformation?.split(', ') || [];

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, instructions.length - 1));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveRecipe = () => {
    if (isSaved) {
      unsaveRecipe(recipe.id);
      Alert.alert('Recipe Unsaved', 'The recipe has been removed from your collection.');
    } else {
      saveRecipe(recipe);
      Alert.alert('Recipe Saved!', `${recipe.recipeName} has been added to your collection.`);
    }
  };

  const handleSubstitution = (ingredient: string) => {
    Alert.alert(
      'Ingredient Substitution',
      `Looking for substitutes for: ${ingredient}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
          <Ionicons 
            name={isSaved ? "heart" : "heart-outline"} 
            size={24} 
            color={isSaved ? "#ff6b6b" : "white"} 
          />
        </TouchableOpacity>
        <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
      </View>

      <View style={styles.content}>
        <Text style={styles.recipeTitle}>{recipe.recipeName}</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Ingredients</Text>
          </View>
          <View style={styles.ingredientsList}>
            {ingredients.map((item, index) => (
              <View key={index} style={styles.ingredientItem}>
                <Text style={styles.ingredientText}>{item}</Text>
                <TouchableOpacity
                  style={styles.substituteButton}
                  onPress={() => handleSubstitution(item)}
                >
                  <Text style={styles.substituteText}>Substitute</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {nutrition.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="analytics" size={20} color="#007AFF" />
              <Text style={styles.sectionTitle}>Nutrition</Text>
            </View>
            <View style={styles.nutritionContainer}>
              {nutrition.map((item, index) => (
                <View key={index} style={styles.nutritionBadge}>
                  <Text style={styles.nutritionText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="restaurant" size={20} color="#007AFF" />
            <Text style={styles.sectionTitle}>Instructions</Text>
          </View>
          <View style={styles.instructionsContainer}>
            {instructions.map((step, index) => (
              <View
                key={index}
                style={[
                  styles.stepContainer,
                  currentStep === index && styles.activeStep,
                ]}
              >
                <Text style={styles.stepNumber}>Step {index + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
          <View style={styles.stepControls}>
            <TouchableOpacity
              style={[styles.stepButton, currentStep === 0 && styles.stepButtonDisabled]}
              onPress={goToPreviousStep}
              disabled={currentStep === 0}
            >
              <Text style={styles.stepButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.stepCounter}>
              Step {currentStep + 1} of {instructions.length}
            </Text>
            <TouchableOpacity
              style={[
                styles.stepButton,
                currentStep === instructions.length - 1 && styles.stepButtonDisabled,
              ]}
              onPress={goToNextStep}
              disabled={currentStep === instructions.length - 1}
            >
              <Text style={styles.stepButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  saveButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 1,
  },
  content: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  substituteButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  substituteText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nutritionBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  nutritionText: {
    fontSize: 14,
    color: '#374151',
  },
  instructionsContainer: {
    gap: 16,
  },
  stepContainer: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeStep: {
    backgroundColor: '#eff6ff',
    borderColor: '#007AFF',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  stepControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  stepButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  stepButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  stepButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  stepCounter: {
    fontSize: 14,
    color: '#666',
  },
});