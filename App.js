import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import MapScreen from './screens/MapScreen';
import NavigationScreen from './screens/NavigationScreen';
import ArrivalScreen from './screens/ArrivalScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Map"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Navigation" component={NavigationScreen} />
        <Stack.Screen name="Arrival" component={ArrivalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
