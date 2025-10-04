import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppState } from '../context/AppProvider';
import WelcomeScreen from '../components/WelcomeScreen';
import GenerateRecipeForm from '../components/GenerateRecipeForm';
import RecipeView from '../components/RecipeView';

export default function HomeScreen() {
  const { currentRecipe } = useAppState();
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {currentRecipe ? (
          <RecipeView 
            recipe={currentRecipe} 
            onBack={() => navigation.goBack()}
          />
        ) : (
          <View style={styles.formContainer}>
            <WelcomeScreen />
            <GenerateRecipeForm />
          </View>
        )}
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
  formContainer: {
    alignItems: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
});