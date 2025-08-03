import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, SafeAreaView } from 'react-native';
import { Text, List, Appbar, Button, Dialog, Portal, TextInput } from 'react-native-paper';

export default function personal({ navigation }) {
  const [empleados, setEmpleados] = useState([
    { id: '1', nombre: 'Juan Pérez', puesto: 'Almacén' },
    { id: '2', nombre: 'María García', puesto: 'Ventas' },
    { id: '3', nombre: 'Carlos López', puesto: 'Reparto' },
  ]);

  const [visible, setVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoActual, setEmpleadoActual] = useState(null);
  const [form, setForm] = useState({ nombre: '', puesto: '' });

  const abrirDialogoAgregar = () => {
    setModoEdicion(false);
    setForm({ nombre: '', puesto: '' });
    setVisible(true);
  };

  const abrirDialogoEditar = (empleado) => {
    setModoEdicion(true);
    setEmpleadoActual(empleado);
    setForm({ nombre: empleado.nombre, puesto: empleado.puesto });
    setVisible(true);
  };

  const cerrarDialogo = () => {
    setVisible(false);
    setForm({ nombre: '', puesto: '' });
    setEmpleadoActual(null);
  };

  const guardarEmpleado = () => {
    if (!form.nombre || !form.puesto) return;

    if (modoEdicion) {
      setEmpleados((prev) =>
        prev.map((e) => (e.id === empleadoActual.id ? { ...e, ...form } : e))
      );
    } else {
      const nuevo = {
        id: Date.now().toString(),
        ...form,
      };
      setEmpleados((prev) => [...prev, nuevo]);
    }

    cerrarDialogo();
  };

  const eliminarEmpleado = (id) => {
    Alert.alert('¿Eliminar empleado?', 'Esta acción no se puede deshacer', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: () => setEmpleados((prev) => prev.filter((e) => e.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF9C4' }}>
      <Appbar.Header style={{ backgroundColor: '#FFF9C4' }}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Personal" />
      </Appbar.Header>

      <View style={styles.container}>
        <FlatList
          data={empleados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <List.Item
              title={item.nombre}
              description={`Puesto: ${item.puesto}`}
              left={() => <List.Icon icon="account" />}
              right={() => (
                <>
                  <Appbar.Action icon="pencil" onPress={() => abrirDialogoEditar(item)} />
                  <Appbar.Action icon="delete" onPress={() => eliminarEmpleado(item.id)} />
                </>
              )}
            />
          )}
          ListHeaderComponent={<Text style={styles.header}>Lista de empleados</Text>}
        />

        <Button mode="contained" onPress={abrirDialogoAgregar} style={{ marginTop: 20 }}>
          Añadir empleado
        </Button>

        <Portal>
          <Dialog visible={visible} onDismiss={cerrarDialogo}>
            <Dialog.Title>{modoEdicion ? 'Editar empleado' : 'Nuevo empleado'}</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Nombre"
                value={form.nombre}
                onChangeText={(text) => setForm({ ...form, nombre: text })}
              />
              <TextInput
                label="Puesto"
                value={form.puesto}
                onChangeText={(text) => setForm({ ...form, puesto: text })}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={cerrarDialogo}>Cancelar</Button>
              <Button onPress={guardarEmpleado}>Guardar</Button>
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
