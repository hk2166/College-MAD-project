import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider } from './src/context/AppProvider';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import PantryScreen from './src/screens/PantryScreen';
import SavedRecipesScreen from './src/screens/SavedRecipesScreen';
import RecipeViewScreen from './src/screens/RecipeViewScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Pantry') {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#f8f9fa',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Culinary Copilot' }}
      />
      <Tab.Screen 
        name="Pantry" 
        component={PantryScreen} 
        options={{ title: 'My Pantry' }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedRecipesScreen} 
        options={{ title: 'Saved Recipes' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="RecipeView" 
            component={RecipeViewScreen} 
            options={{ 
              headerShown: true,
              title: 'Recipe Details',
              headerBackTitle: 'Back'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}