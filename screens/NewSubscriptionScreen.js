import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewSubscriptionScreen({ navigation }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [renewalDate, setRenewalDate] = useState('');

  const addSubscription = async () => {
    const newSubscription = { id: Date.now().toString(), name, amount, renewalDate };
    const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
    const subscriptions = storedSubscriptions ? JSON.parse(storedSubscriptions) : [];
    subscriptions.push(newSubscription);
    await AsyncStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} />
      <TextInput placeholder="Renewal Date" value={renewalDate} onChangeText={setRenewalDate} />
      <Button title="Add Subscription" onPress={addSubscription} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});