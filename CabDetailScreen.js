import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ImageBackground } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const CabDetailScreen = ({ route, navigation }) => {
  const { cabId } = route.params;
  const [cab, setCab] = useState(null);
  const [bookedCabs, setBookedCabs] = useState([]);
  const userId = 'user1'; 

  useEffect(() => {
    const loadCab = async () => {
      try {
        const cabDoc = doc(db, 'Cabs', cabId);
        const snapshot = await getDoc(cabDoc);
        if (snapshot.exists()) {
          setCab(snapshot.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching cab details: ", error);
      }
    };

    const loadBookings = async () => {
      try {
        const bookingsQuery = query(collection(db, 'bookings'), where('userId', '==', userId));
        const snapshot = await getDocs(bookingsQuery);
        const bookings = snapshot.docs.map(doc => doc.data());
        setBookedCabs(bookings);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
      }
    };

    loadCab();
    loadBookings();
  }, [cabId]);

  const handleBook = async () => {
    if (bookedCabs.length >= 2) {
      Alert.alert('Booking Limit Reached', 'You cannot book more than 2 cabs at a time.');
      return;
    }

    try {
      const bookingRef = doc(collection(db, 'bookings'));
      await setDoc(bookingRef, {
        userId,
        cabId,
        companyName: cab.companyName, 
        carModel: cab.carModel,      
        bookingStatus: 'confirmed',
        bookingDate: new Date().toISOString(),
      });
      Alert.alert('Booking Successful', 'Your cab has been booked.');
    } catch (error) {
      console.error("Error booking cab: ", error);
    }
  };

  if (!cab) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Paragraph>Loading...</Paragraph>
      </View>
    );
  }

  return (
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>{cab.companyName}</Title>
            <Paragraph style={styles.paragraph}>Car Model: {cab.carModel}</Paragraph>
            <Paragraph style={styles.paragraph}>Passenger Capacity: {cab.passengerCapacity}</Paragraph>
            <Paragraph style={styles.paragraph}>Rating: {cab.rating}</Paragraph>
            <Paragraph style={styles.paragraph}>Cost per Hour: ${cab.costPerHour}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleBook} style={styles.button}>
              Book Cab
            </Button>
          </Card.Actions>
        </Card>
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
    backgroundColor: '#e0e8f0', // Added transparency for better readability
    padding: 16,
  },
  card: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#e2dbde',
    borderRadius: 8, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 18, 
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    
  },
  button: {
    marginTop: 16,
    backgroundColor: '#7B5A67', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default CabDetailScreen;
