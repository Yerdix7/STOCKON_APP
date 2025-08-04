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
    if (!form.nombre || !form.puesto) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }

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
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={{ backgroundColor: '#FFF9C4' }}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Personal" />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
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
                    <Appbar.Action
                      icon="pencil"
                      onPress={() => abrirDialogoEditar(item)}
                    />
                    <Appbar.Action
                      icon="delete"
                      onPress={() => eliminarEmpleado(item.id)}
                    />
                  </>
                )}
              />
            )}
            ListHeaderComponent={
              <Text style={styles.header}>Lista de empleados</Text>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>

        <View style={styles.floatingButtonContainer}>
          <Button
            mode="contained"
            onPress={abrirDialogoAgregar}
            style={styles.floatingButton}
          >
            Añadir empleado
          </Button>
        </View>

        {/* Modal personalizado para evitar conflictos con teclado */}
        <Modal visible={visible} animationType="slide" transparent>
          <View style={styles.modalBackground}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <ScrollView contentContainerStyle={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {modoEdicion ? 'Editar empleado' : 'Nuevo empleado'}
                </Text>

                <TextInput
                  label="Nombre"
                  value={form.nombre}
                  onChangeText={(text) => setForm({ ...form, nombre: text })}
                  style={styles.input}
                />
                <TextInput
                  label="Puesto"
                  value={form.puesto}
                  onChangeText={(text) => setForm({ ...form, puesto: text })}
                  style={styles.input}
                />

                <View style={styles.modalActions}>
                  <Button onPress={cerrarDialogo} style={{ marginRight: 10 }}>
                    Cancelar
                  </Button>
                  <Button mode="contained" onPress={guardarEmpleado}>
                    Guardar
                  </Button>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
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
