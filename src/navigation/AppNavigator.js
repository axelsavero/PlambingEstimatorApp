import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MateriListScreen from '../screens/MateriListScreen';
import MateriDetailScreen from '../screens/MateriDetailScreen';
import CalculatorMenuScreen from '../screens/CalculatorMenuScreen';
import SlopeCalcScreen from '../screens/SlopeCalcScreen';
import SepticTankCalcScreen from '../screens/SepticTankCalcScreen';
import FixtureUnitCalcScreen from '../screens/FixtureUnitCalcScreen';
import MaterialEstScreen from '../screens/MaterialEstScreen';
import VolumeCalcScreen from '../screens/VolumeCalcScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack untuk Materi & Panduan
function MateriStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="MateriList" 
        component={MateriListScreen} 
        options={{ title: 'Panduan & Pedoman Teknis' }} 
      />
      <Stack.Screen 
        name="MateriDetail" 
        component={MateriDetailScreen} 
        options={{ title: 'Langkah & Rumus Teknis' }} 
      />
    </Stack.Navigator>
  );
}

// Stack untuk Kalkulator & Estimator
function CalculatorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="CalculatorMenu" 
        component={CalculatorMenuScreen} 
        options={{ title: 'Menu Estimator Otomatis' }} 
      />
      <Stack.Screen 
        name="SlopeCalc" 
        component={SlopeCalcScreen} 
        options={{ title: 'Kemiringan Pipa (Slope)' }} 
      />
      <Stack.Screen 
        name="SepticTankCalc" 
        component={SepticTankCalcScreen} 
        options={{ title: 'Dimensi Tangki Septik' }} 
      />
      <Stack.Screen 
        name="FixtureUnitCalc" 
        component={FixtureUnitCalcScreen} 
        options={{ title: 'Unit Beban Alat Plambing' }} 
      />
      <Stack.Screen 
        name="MaterialEst" 
        component={MaterialEstScreen} 
        options={{ title: 'Estimasi Batang Pipa & RAB' }} 
      />
      <Stack.Screen 
        name="VolumeCalc" 
        component={VolumeCalcScreen} 
        options={{ title: 'Volume Struktur & Beton' }} 
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MateriTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'KalkulatorTab') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'RiwayatTab') {
            iconName = focused ? 'time' : 'time-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
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
        options={{ tabBarLabel: 'Panduan' }} 
      />
      <Tab.Screen 
        name="KalkulatorTab" 
        component={CalculatorStack} 
        options={{ tabBarLabel: 'Kalkulator' }} 
      />
      <Tab.Screen 
        name="RiwayatTab" 
        component={HistoryScreen} 
        options={{ 
          tabBarLabel: 'Riwayat',
          headerShown: true,
          headerTitle: 'Riwayat Perhitungan',
          headerStyle: { backgroundColor: '#ffffff' },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: 'bold' },
          headerShadowVisible: false,
        }} 
      />
    </Tab.Navigator>
  );
}