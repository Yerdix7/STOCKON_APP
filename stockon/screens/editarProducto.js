import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';

export default function editarProducto({ route, navigation }) {
  const { producto, index, setInventory } = route.params;

  const [nombre, setNombre] = useState(producto.nombre);
  const [cantidad, setCantidad] = useState(producto.cantidad.toString());
  const [proveedor, setProveedor] = useState(producto.provedor);
  const [fecha, setFecha] = useState(producto.fecha);

  const guardarCambios = () => {
    const productoActualizado = {
      nombre,
      cantidad: parseInt(cantidad),
      provedor: proveedor,
      fecha,
    };

    setInventory((prev) => {
      const copia = [...prev];
      copia[index] = productoActualizado;
      return copia;
    });

    navigation.goBack();
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#FFF9C4' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Producto" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Modificar información</Text>

        <TextInput
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <TextInput
          label="Cantidad"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Proveedor"
          value={proveedor}
          onChangeText={setProveedor}
          style={styles.input}
        />
        <TextInput
          label="Fecha de ingreso"
          value={fecha}
          onChangeText={setFecha}
          placeholder="DD/MM/AAAA"
          style={styles.input}
        />

        <Button mode="contained" onPress={guardarCambios} style={{ marginTop: 20 }}>
          Guardar Cambios
        </Button>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
});
