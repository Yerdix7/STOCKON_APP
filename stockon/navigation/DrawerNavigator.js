import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import home from '../screens/home.js';
import personal from '../screens/personal';
import proveedores from '../screens/proveedores';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="home">
        <Drawer.Screen
            name="home"
            component={home}
            options={{ headerShown: false }}
        />
        <Drawer.Screen
            name="personal"
            component={personal}
            options={{ headerShown: false }}
        />
        <Drawer.Screen
            name="proveedores"
            component={proveedores}
            options={{ headerShown: false }}
        />
    </Drawer.Navigator>

  );
}
