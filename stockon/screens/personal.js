import React, { useEffect, useState } from 'react';
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
import api from '../api';

export default function personal({ navigation }) {
  const [empleados, setEmpleados] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [empleadoActual, setEmpleadoActual] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    horario: '',
    genero: '',
    area: '',
    salario: '',
    contrasena: '',
    id_empresa: 1,
    id_puesto: 1,
  });

  const cargarEmpleados = async () => {
    try {
      const res = await api.get('/empleados/');
      setEmpleados(res.data);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const abrirDialogoAgregar = () => {
    setModoEdicion(false);
    setForm({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      horario: '',
      genero: '',
      area: '',
      salario: '',
      contrasena: '',
      id_empresa: 1,
      id_puesto: 1,
    });
    setVisible(true);
  };

  const abrirDialogoEditar = (empleado) => {
    setModoEdicion(true);
    setEmpleadoActual(empleado);
    setForm({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      correo: empleado.correo,
      telefono: empleado.telefono,
      horario: empleado.horario,
      genero: empleado.genero,
      area: empleado.area,
      salario: empleado.salario.toString(),
      contrasena: empleado.contrasena,
      id_empresa: empleado.id_empresa,
      id_puesto: empleado.id_puesto,
    });
    setVisible(true);
  };

  const cerrarDialogo = () => {
    setVisible(false);
    setEmpleadoActual(null);
  };

  const esCorreoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const guardarEmpleado = async () => {
    const camposObligatorios = [
      'nombre', 'apellido', 'correo', 'telefono',
      'horario', 'genero', 'area', 'salario', 'contrasena',
    ];

    for (let campo of camposObligatorios) {
      if (!form[campo]) {
        Alert.alert('Campos incompletos', `Falta: ${campo}`);
        return;
      }
    }

    if (!esCorreoValido(form.correo)) {
      Alert.alert('Correo inválido', 'Ingresa un correo válido.');
      return;
    }

    try {
      const payload = { ...form, salario: parseFloat(form.salario) };

      if (modoEdicion) {
        await api.put(`/empleados/${empleadoActual.id}`, payload);
      } else {
        await api.post('/empleados/', payload);
      }

      await cargarEmpleados();
      cerrarDialogo();
    } catch (err) {
      console.error('Error al guardar empleado:', err.response?.data || err.message);
    }
  };

  const eliminarEmpleado = (id) => {
    Alert.alert('¿Eliminar empleado?', 'Esta acción no se puede deshacer', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await api.delete(`/empleados/${id}`);
            await cargarEmpleados();
          } catch (err) {
            console.error('Error al eliminar empleado:', err);
          }
        },
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <List.Item
                title={`${item.nombre} ${item.apellido}`}
                description={`Área: ${item.area} | Correo: ${item.correo}`}
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

                {[
                  ['Nombre', 'nombre'],
                  ['Apellido', 'apellido'],
                  ['Correo', 'correo', 'email-address'],
                  ['Teléfono', 'telefono', 'phone-pad'],
                  ['Horario', 'horario'],
                  ['Género', 'genero'],
                  ['Área', 'area'],
                  ['Salario', 'salario', 'decimal-pad'],
                  ['Contraseña', 'contrasena'],
                ].map(([label, field, keyboard]) => (
                  <TextInput
                    key={field}
                    label={label}
                    value={form[field]}
                    onChangeText={(text) => setForm({ ...form, [field]: text })}
                    keyboardType={keyboard || 'default'}
                    style={styles.input}
                    secureTextEntry={field === 'contrasena'}
                  />
                ))}

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
