import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, SafeAreaView } from 'react-native';
import { Text, List, Appbar, Button, Dialog, Portal, TextInput } from 'react-native-paper';

export default function proveedores({ navigation }) {
  const [proveedores, setProveedores] = useState([
    { id: '1', nombre: 'Distribuidora Norte', contacto: 'distribuidora@gmail.com' },
    { id: '2', nombre: 'Proveedora Max', contacto: 'max@hotmail.com' },
  ]);

  const [visible, setVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proveedorActual, setProveedorActual] = useState(null);
  const [form, setForm] = useState({ nombre: '', contacto: '' });

  const abrirDialogoAgregar = () => {
    setModoEdicion(false);
    setForm({ nombre: '', contacto: '' });
    setVisible(true);
  };

  const abrirDialogoEditar = (proveedor) => {
    setModoEdicion(true);
    setProveedorActual(proveedor);
    setForm({ nombre: proveedor.nombre, contacto: proveedor.contacto });
    setVisible(true);
  };

  const cerrarDialogo = () => {
    setVisible(false);
    setForm({ nombre: '', contacto: '' });
    setProveedorActual(null);
  };

  const guardarProveedor = () => {
    if (!form.nombre || !form.contacto) return;

    if (modoEdicion) {
      setProveedores((prev) =>
        prev.map((p) => (p.id === proveedorActual.id ? { ...p, ...form } : p))
      );
    } else {
      const nuevo = {
        id: Date.now().toString(),
        ...form,
      };
      setProveedores((prev) => [...prev, nuevo]);
    }

    cerrarDialogo();
  };

  const eliminarProveedor = (id) => {
    Alert.alert('¿Eliminar proveedor?', 'Esta acción no se puede deshacer', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: () => setProveedores((prev) => prev.filter((p) => p.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF9C4' }}>
      <Appbar.Header style={{ backgroundColor: '#FFF9C4' }}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Proveedores" />
      </Appbar.Header>

      <View style={styles.container}>
        <FlatList
          data={proveedores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.nombre}
              description={`Contacto: ${item.contacto}`}
              left={() => <List.Icon icon="truck" />}
              right={() => (
                <>
                  <Appbar.Action icon="pencil" onPress={() => abrirDialogoEditar(item)} />
                  <Appbar.Action icon="delete" onPress={() => eliminarProveedor(item.id)} />
                </>
              )}
            />
          )}
          ListHeaderComponent={<Text style={styles.header}>Lista de proveedores</Text>}
        />

        <Button mode="contained" onPress={abrirDialogoAgregar} style={{ marginTop: 20 }}>
          Añadir proveedor
        </Button>

        <Portal>
          <Dialog visible={visible} onDismiss={cerrarDialogo}>
            <Dialog.Title>{modoEdicion ? 'Editar proveedor' : 'Nuevo proveedor'}</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Nombre"
                value={form.nombre}
                onChangeText={(text) => setForm({ ...form, nombre: text })}
              />
              <TextInput
                label="Contacto"
                value={form.contacto}
                onChangeText={(text) => setForm({ ...form, contacto: text })}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={cerrarDialogo}>Cancelar</Button>
              <Button onPress={guardarProveedor}>Guardar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
