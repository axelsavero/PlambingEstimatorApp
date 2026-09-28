import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import MateriListScreen from '../screens/MateriListScreen';
import MateriDetailScreen from '../screens/MateriDetailScreen';
import CalculatorMenuScreen from '../screens/CalculatorMenuScreen';
import SlopeCalcScreen from '../screens/SlopeCalcScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack untuk Materi
function MateriStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MateriList" 
        component={MateriListScreen} 
        options={{ title: 'Panduan & Teori' }} 
      />
      <Stack.Screen 
        name="MateriDetail" 
        component={MateriDetailScreen} 
        options={{ title: 'Detail Materi' }} 
      />
    </Stack.Navigator>
  );
}

// Stack untuk Kalkulator
function CalculatorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CalculatorMenu" 
        component={CalculatorMenuScreen} 
        options={{ title: 'Menu Kalkulator' }} 
      />
      <Stack.Screen 
        name="SlopeCalc" 
        component={SlopeCalcScreen} 
        options={{ title: 'Hitung Kemiringan Pipa' }} 
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0284c7', // Warna biru teknik
        tabBarInactiveTintColor: '#64748b',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = 'home-outline';
          else if (route.name === 'MateriTab') iconName = 'book-outline';
          else if (route.name === 'KalkulatorTab') iconName = 'calculator-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Beranda' }} 
      />
      <Tab.Screen 
        name="MateriTab" 
        component={MateriStack} 
        options={{ tabBarLabel: 'Materi' }} 
      />
      <Tab.Screen 
        name="KalkulatorTab" 
        component={CalculatorStack} 
        options={{ tabBarLabel: 'Kalkulator' }} 
      />
    </Tab.Navigator>
  );
}