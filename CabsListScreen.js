import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ImageBackground } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const CabsListScreen = ({ navigation }) => {
  const [cabs, setCabs] = useState([]);

  useEffect(() => {
    const loadCabs = async () => {
      try {
        const cabsCollection = collection(db, 'Cabs');
        const snapshot = await getDocs(cabsCollection);
        const cabList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCabs(cabList);
      } catch (error) {
        console.error("Error fetching cabs: ", error);
      }
    };
    loadCabs();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title style={styles.title}>{item.companyName}</Title>
        <Paragraph style={styles.paragraph}>{item.carModel}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Cab Detail', { cabId: item.id })}
          style={styles.button}
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
      <View style={styles.overlay}>
        <FlatList
          data={cabs}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#e0e8f0', 
    padding: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#e2dbde',
    elevation: 4,
    borderRadius: 8, 
    padding: 16, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15, 
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#7B5A67', 
  },
});

export default CabsListScreen;
