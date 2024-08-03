import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import CabsListScreen from './CabsListScreen';
import CabDetailScreen from './CabDetailScreen';
import MyCabScreen from './MyCabScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Cabs List" component={CabsListScreen} />
      <Stack.Screen name="Cab Detail" component={CabDetailScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator
function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My Cab"
        component={MyCabScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// App Component
export default function App() {
  return (
    <NavigationContainer>
      <AppTabs />
    </NavigationContainer>
  );
}
