import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import RecipeView from '../components/RecipeView';
import { Recipe } from '../types';

type RootStackParamList = {
  RecipeView: { recipe: Recipe };
};

type RecipeViewScreenRouteProp = RouteProp<RootStackParamList, 'RecipeView'>;

export default function RecipeViewScreen() {
  const route = useRoute<RecipeViewScreenRouteProp>();
  const { recipe } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <RecipeView recipe={recipe} />
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