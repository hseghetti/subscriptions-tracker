import React, { useState } from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditSubscriptionScreen({ navigation, route }) {
  const { subscription } = route.params;
  const [name, setName] = useState(subscription.name);
  const [amount, setAmount] = useState(subscription.amount);
  const [renewalDate, setRenewalDate] = useState(subscription.renewalDate);

  const updateSubscription = async () => {
    const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
    const subscriptions = JSON.parse(storedSubscriptions);
    const index = subscriptions.findIndex((item) => item.id === subscription.id);
    subscriptions[index] = { ...subscription, name, amount, renewalDate };
    await AsyncStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    navigation.goBack();
  };

  const deleteSubscription = async () => {
    const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
    const subscriptions = JSON.parse(storedSubscriptions);
    const newSubscriptions = subscriptions.filter((item) => item.id !== subscription.id);
    await AsyncStorage.setItem('subscriptions', JSON.stringify(newSubscriptions));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput value={name} onChangeText={setName} />
      <TextInput value={amount} onChangeText={setAmount} />
      <TextInput value={renewalDate} onChangeText={setRenewalDate} />
      <Button title="Update Subscription" onPress={updateSubscription} />
      <Button title="Delete Subscription" onPress={deleteSubscription} />
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