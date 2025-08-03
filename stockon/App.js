import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import DrawerNavigator from './navigation/DrawerNavigator';
import home from './screens/home';
import infoProducto from './screens/infoProducto';
import editarProducto from './screens/editarProducto';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="infoProducto"
            component={infoProducto}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="editarProducto"
            component={editarProducto}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

