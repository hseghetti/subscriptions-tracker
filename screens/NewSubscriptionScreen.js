import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Input } from '@rneui/themed';

export default function NewSubscriptionScreen({ navigation }) {
  const [initialRender, setInitialRender] = useState(true);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const addSubscription = async () => {
    if (initialRender) {
      setInitialRender(false);
    }1
    if (!isFormValid) {
      return;
    }
    const newSubscription = { id: Date.now().toString(), name, amount, renewalDate };
    const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
    const subscriptions = storedSubscriptions ? JSON.parse(storedSubscriptions) : [];
    subscriptions.push(newSubscription);
    await AsyncStorage.setItem('subscriptions', JSON.stringify(subscriptions));
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
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Add Subscription" onPress={addSubscription} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});