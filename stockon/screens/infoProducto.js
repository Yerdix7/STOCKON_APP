import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button, Card, Appbar } from 'react-native-paper';

export default function infoProducto({ route, navigation }) {
  const { producto } = route.params;

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#FFF9C4' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Información del Producto" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <Card>
          <Card.Title title={producto.nombre} />
          <Card.Content>
            <Text style={styles.label}>Cantidad:</Text>
            <Text style={styles.value}>{producto.cantidad}</Text>

            <Text style={styles.label}>Proveedor:</Text>
            <Text style={styles.value}>{producto.provedor}</Text>

            <Text style={styles.label}>Fecha de ingreso:</Text>
            <Text style={styles.value}>{producto.fecha}</Text>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('editarProducto', { producto })}
            style={{ marginBottom: 10 }}
          >
            Modificar
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
          >
            Regresar
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    marginBottom: 10,
    color: '#222',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
