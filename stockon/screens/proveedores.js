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

export default function proveedores({ navigation }) {
  const [proveedores, setProveedores] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [proveedorActual, setProveedorActual] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    numTelefono: '',
    tipoProducto: '',
    condicionesPago: '',
    frecuenciaSuministro: '',
    horarioAtencion: '',
    pais: '',
    ciudad: '',
    id_empresa: 1, // <-- puedes cambiar esto después según login
  });

  const cargarProveedores = async () => {
    try {
      const res = await api.get(`/proveedores/empresa/${form.id_empresa}`);
      setProveedores(res.data);
    } catch (err) {
      console.error('Error al obtener proveedores:', err);
    }
  };

  useEffect(() => {
    cargarProveedores();
  }, []);

  const abrirDialogoAgregar = () => {
    setModoEdicion(false);
    setForm({
      nombre: '',
      correo: '',
      numTelefono: '',
      tipoProducto: '',
      condicionesPago: '',
      frecuenciaSuministro: '',
      horarioAtencion: '',
      pais: '',
      ciudad: '',
      id_empresa: 1,
    });
    setVisible(true);
  };

  const abrirDialogoEditar = (p) => {
    setModoEdicion(true);
    setProveedorActual(p);
    setForm({
      nombre: p.nombre,
      correo: p.correo,
      numTelefono: p.numTelefono,
      tipoProducto: p.tipoProducto,
      condicionesPago: p.condicionesPago,
      frecuenciaSuministro: p.frecuenciaSuministro,
      horarioAtencion: p.horarioAtencion,
      pais: p.pais,
      ciudad: p.ciudad,
      id_empresa: p.id_empresa,
    });
    setVisible(true);
  };

  const cerrarDialogo = () => {
    setVisible(false);
    setProveedorActual(null);
  };

  const esCorreoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const guardarProveedor = async () => {
    const camposRequeridos = [
      'nombre', 'correo', 'numTelefono', 'tipoProducto', 'condicionesPago',
      'frecuenciaSuministro', 'horarioAtencion', 'pais', 'ciudad',
    ];

    for (let campo of camposRequeridos) {
      if (!form[campo]) {
        Alert.alert('Campos incompletos', `Falta: ${campo}`);
        return;
      }
    }

    if (!esCorreoValido(form.correo)) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
      return;
    }

    try {
      if (modoEdicion) {
        await api.put(`/proveedores/${proveedorActual.id}`, form);
      } else {
        await api.post('/proveedores/', form);
      }
      await cargarProveedores();
      cerrarDialogo();
    } catch (err) {
      console.error('Error al guardar proveedor:', err.response?.data || err.message);
    }
  };

  const eliminarProveedor = (id) => {
    Alert.alert('¿Eliminar proveedor?', 'Esta acción no se puede deshacer', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await api.delete(`/proveedores/${id}`);
            await cargarProveedores();
          } catch (err) {
            console.error('Error al eliminar proveedor:', err);
          }
        },
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.nombre}
              description={`Correo: ${item.correo}`}
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

                {[
                  ['Nombre', 'nombre'],
                  ['Correo de contacto', 'correo', 'email-address'],
                  ['Número de teléfono', 'numTelefono', 'phone-pad'],
                  ['Tipo de producto', 'tipoProducto'],
                  ['Condiciones de pago', 'condicionesPago'],
                  ['Frecuencia de suministro', 'frecuenciaSuministro'],
                  ['Horario de atención', 'horarioAtencion'],
                  ['País', 'pais'],
                  ['Ciudad', 'ciudad'],
                ].map(([label, field, keyboard]) => (
                  <TextInput
                    key={field}
                    label={label}
                    value={form[field]}
                    onChangeText={(text) => setForm({ ...form, [field]: text })}
                    keyboardType={keyboard || 'default'}
                    style={styles.input}
                  />
                ))}

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
