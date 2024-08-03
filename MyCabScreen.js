import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import { db } from './firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';

const MyCabScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 'user1'; 

  useEffect(() => {
    const bookingsQuery = query(collection(db, 'bookings'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const bookingList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      Alert.alert('Booking Cancelled', 'Your booking has been cancelled.');
    } catch (error) {
      console.error("Error cancelling booking: ", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Paragraph>Loading...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>{item.companyName}</Title>
              <Paragraph style={styles.paragraph}>Car Model: {item.carModel}</Paragraph>
              <Paragraph style={styles.paragraph}>Status: {item.bookingStatus}</Paragraph>
              <Paragraph style={styles.paragraph}>Booking Date: {new Date(item.bookingDate).toLocaleDateString()}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={() => handleCancelBooking(item.id)} 
                style={styles.button} 
                buttonColor="#ff5252"
                textColor="#fff"
              >
                Cancel Booking
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e0e8f0', 
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
    marginBottom: 8, 
  },
  button: {
    marginTop: 16,
    backgroundColor: '#7B5A67', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa', 
  },
});

export default MyCabScreen;
