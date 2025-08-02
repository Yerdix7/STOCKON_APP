import React, { useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {
  Appbar,
  Button,
  TextInput,
  Dialog,
  Portal,
  List,
  Text,
  Provider as PaperProvider,
} from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DrawerLayoutAndroid } from 'react-native';

export default function App() {
  const [inventory, setInventory] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    cantidad: '',
    provedor: '',
    fecha: '',
  });

  const openDialog = () => setVisible(true);
  const closeDialog = () => {
    setVisible(false);
    setForm({ nombre: '', cantidad: '', provedor: '', fecha: '' });
  };

  const addItem = () => {
    if (!form.nombre || !form.cantidad || !form.provedor || !form.fecha) return;
    setInventory([...inventory, form]);
    closeDialog();
  };

  const deleteItem = (index) => {
    Alert.alert('¿Eliminar producto?', 'Esta acción no se puede deshacer', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: () => {
          const updated = [...inventory];
          updated.splice(index, 1);
          setInventory(updated);
        },
      },
    ]);
  };

  const drawer = (
    <View style={{ padding: 20 }}>
      <Text variant="titleLarge" style={{ marginBottom: 20 }}>
        Menú
      </Text>
      <Button mode="outlined" onPress={openDialog}>
        Añadir Inventario
      </Button>
    </View>
  );

  const renderInventory = () => (
    <View style={styles.container}>
      <Image source={require('./assets/logo.jpeg')} style={styles.logo} />
      {inventory.length === 0 ? (
        <Text style={styles.emptyText}>Sin inventario</Text>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <List.Item
              title={`${item.nombre} - ${item.cantidad} unidades`}
              description={`Proveedor: ${item.provedor} | Ingreso: ${item.fecha}`}
              right={() => (
                <>
                  <Appbar.Action icon="pencil" onPress={() => Alert.alert("Modificar no implementado aún")} />
                  <Appbar.Action icon="delete" onPress={() => deleteItem(index)} />
                </>
              )}
            />
          )}
        />
      )}
      {Platform.OS === 'web' && (
        <Button mode="contained" onPress={openDialog} style={{ marginTop: 15 }}>
          Añadir inventario
        </Button>
      )}
      <Portal>
        <Dialog visible={visible} onDismiss={closeDialog}>
          <Dialog.Title>Añadir producto</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nombre"
              value={form.nombre}
              onChangeText={(text) => setForm({ ...form, nombre: text })}
            />
            <TextInput
              label="Cantidad"
              value={form.cantidad}
              keyboardType="numeric"
              onChangeText={(text) => setForm({ ...form, cantidad: text })}
            />
            <TextInput
              label="Proveedor"
              value={form.provedor}
              onChangeText={(text) => setForm({ ...form, provedor: text })}
            />
            <TextInput
              label="Fecha de ingreso"
              value={form.fecha}
              placeholder="DD/MM/AAAA"
              onChangeText={(text) => setForm({ ...form, fecha: text })}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={closeDialog}>Cancelar</Button>
            <Button onPress={addItem}>Guardar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );

  return (
    <PaperProvider>
      <SafeAreaProvider>
        {Platform.OS === 'android' ? (
          <DrawerLayoutAndroid
            drawerWidth={250}
            drawerPosition="left"
            renderNavigationView={() => drawer}
            ref={(drawerRef) => (this.drawer = drawerRef)}
          >
            <Appbar.Header style={{ backgroundColor: '#FFF9C4' }}>
              <Appbar.Action icon="menu" onPress={() => this.drawer.openDrawer()} />
              <Appbar.Content title="Stock On" />
            </Appbar.Header>
            {renderInventory()}
          </DrawerLayoutAndroid>
        ) : (
          <>
            <Appbar.Header style={{ backgroundColor: '#FFF9C4' }}>
              <Appbar.Content title="Stock On (Web)" />
            </Appbar.Header>
            {renderInventory()}
          </>
        )}
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  logo: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
  },
});
