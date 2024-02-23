import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Input } from '@rneui/themed';

export default function EditSubscriptionScreen({ navigation, route }) {
  const [initialRender, setInitialRender] = useState(true);
  const { subscription } = route.params;
  const [name, setName] = useState(subscription.name);
  const [amount, setAmount] = useState(subscription.amount);
  const [renewalDate, setRenewalDate] = useState(subscription.renewalDate);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const updateSubscription = async () => {
    if (initialRender) {
      setInitialRender(false);
    }
    if (!isFormValid) {
      return;
    }
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

  useEffect(() => {
    validateForm();
  }, [name, amount, renewalDate]);

  const validateForm = () => {
      let errors = {};
      const dateRegex = /^(0[1-9]|1[0-2])\/([0-2][0-9]|3[0-1])$/;

      if (!name) {
          errors.name = 'Name is required.';
      }

      if (!amount) {
          errors.amount = 'Monthly Cost is required.';
      } else if (!/^\d*\.?\d*$/.test(amount)) {
          errors.amount = 'Monthly Cost format is invalid.';
      }

      if (!renewalDate) {
          errors.renewalDate = 'Renewal Date is required.';
      } else if (dateRegex.test(renewalDate) === false) {
          errors.renewalDate = 'Renewal Date must be MM/DD format.';
      }

      setErrors(errors);
      setIsFormValid(Object.keys(errors).length === 0);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Description"
        onChangeText={value => setName(value)}
        value={name}
        errorMessage={!initialRender && errors.name}
      />
      <Input
        placeholder="Monthly Cost ($)"
        onChangeText={value => setAmount(value)}
        value={amount}
        errorMessage={!initialRender && errors.amount}
      />
      <Input
        placeholder="Renewal Date (MM/DD)"
        onChangeText={value => setRenewalDate(value)}
        value={renewalDate}
        errorMessage={!initialRender && errors.renewalDate}
      />
      <View style={styles.buttonRow}>
        <Button title="Update Subscription" onPress={updateSubscription} />
        <Button title="Delete Subscription" onPress={deleteSubscription} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});