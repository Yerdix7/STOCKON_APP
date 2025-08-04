import React, { useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Appbar,
  Button,
  List,
  Text,
  TextInput,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function home({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [visible, setVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const isFutureDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day);
    return inputDate > new Date();
  };

  const addItem = () => {
    if (!form.nombre || !form.cantidad || !form.provedor || !form.fecha) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
      return;
    }
    if (isFutureDate(form.fecha)) {
      Alert.alert('Fecha inválida', 'No puedes ingresar una fecha futura.');
      return;
    }
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

  const renderInventory = () => (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/logo.jpeg')} style={styles.logo} />
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
              onPress={() => navigation.navigate('infoProducto', { producto: item })}
              right={() => (
                <>
                  <Appbar.Action
                    icon="pencil"
                    onPress={() =>
                      navigation.navigate('editarProducto', {
                        producto: item,
                        index,
                        setInventory,
                      })
                    }
                  />
                  <Appbar.Action icon="delete" onPress={() => deleteItem(index)} />
                </>
              )}
            />
          )}
        />
      )}

      <Button mode="contained" onPress={openDialog} style={styles.floatingButton}>
        Añadir producto
      </Button>

      {/* Modal personalizado */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalTitle}>Añadir producto</Text>

              <TextInput
                label="Nombre"
                value={form.nombre}
                onChangeText={(text) => setForm({ ...form, nombre: text })}
                style={styles.input}
              />
              <TextInput
                label="Cantidad"
                value={form.cantidad}
                keyboardType="numeric"
                onChangeText={(text) => setForm({ ...form, cantidad: text })}
                style={styles.input}
              />
              <TextInput
                label="Proveedor"
                value={form.provedor}
                onChangeText={(text) => setForm({ ...form, provedor: text })}
                style={styles.input}
              />

              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  label="Fecha de ingreso"
                  value={form.fecha}
                  editable={false}
                  right={<TextInput.Icon icon="calendar" />}
                  style={styles.input}
                />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      const dia = selectedDate.getDate().toString().padStart(2, '0');
                      const mes = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                      const año = selectedDate.getFullYear();
                      const fechaFormateada = `${dia}/${mes}/${año}`;
                      setForm({ ...form, fecha: fechaFormateada });
                    }
                  }}
                />
              )}

              <View style={styles.modalActions}>
                <Button onPress={closeDialog} style={{ marginRight: 10 }}>Cancelar</Button>
                <Button mode="contained" onPress={addItem}>Guardar</Button>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#FFF9C4' }}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Inventario" />
      </Appbar.Header>

      {renderInventory()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    paddingBottom: 30, // espacio extra para que el botón no se baje
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
  input: {
    marginBottom: 10,
  },
  floatingButton: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 30,
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
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
});
