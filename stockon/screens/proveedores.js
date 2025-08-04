import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import {
  Text,
  List,
  Appbar,
  Button,
  TextInput,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  const esCorreoValido = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const guardarProveedor = () => {
    if (!form.nombre || !form.contacto) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }

    if (!esCorreoValido(form.contacto)) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

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
    <SafeAreaView style={styles.safeArea}>
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
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <View style={styles.floatingButtonContainer}>
          <Button mode="contained" onPress={abrirDialogoAgregar} style={styles.floatingButton}>
            Añadir proveedor
          </Button>
        </View>

        {/* Modal personalizado con validación de correo */}
        <Modal visible={visible} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {modoEdicion ? 'Editar proveedor' : 'Nuevo proveedor'}
                </Text>

                <TextInput
                  label="Nombre"
                  value={form.nombre}
                  onChangeText={(text) => setForm({ ...form, nombre: text })}
                  style={styles.input}
                />
                <TextInput
                  label="Contacto"
                  value={form.contacto}
                  onChangeText={(text) => setForm({ ...form, contacto: text })}
                  style={styles.input}
                  keyboardType="email-address"
                />

                <View style={styles.modalActions}>
                  <Button onPress={cerrarDialogo} style={{ marginRight: 10 }}>
                    Cancelar
                  </Button>
                  <Button mode="contained" onPress={guardarProveedor}>
                    Guardar
                  </Button>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9C4',
  },
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
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  floatingButton: {
    alignSelf: 'center',
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
});
