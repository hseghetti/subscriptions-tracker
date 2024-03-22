import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input, ButtonGroup } from '@rneui/themed';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'x';

export default function NewSubscriptionScreen({ navigation, route }) {
  const { subscription } = route.params || {};
  const [initialRender, setInitialRender] = useState(true);
  const [name, setName] = useState(subscription?.name || '');
  const [amount, setAmount] = useState(subscription?.amount || '');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(subscription?.selectedTypeIndex || 0); // ['Monthly', 'Biannual', 'Annual'
  const [selectedMonthIndex1, setSelectedMonthIndex1] = useState(subscription?.selectedMonthIndex1 || 0);
  const [selectedMonthIndex2, setSelectedMonthIndex2] = useState(subscription?.selectedMonthIndex2 || undefined);
  const SUBSCRIPTIONS_TYPES = ['Monthly', 'Semi-Annual', 'Annual'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const addSubscription = async () => {
    if (initialRender) {
      setInitialRender(false);
    }
    if (!isFormValid) {
      return;
    }
    const newSubscription = { id: Date.now().toString(), name, amount, monthlyCost: getMonthlyCost(amount), selectedMonthIndex1, selectedMonthIndex2, selectedTypeIndex};
    const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
    const subscriptions = storedSubscriptions ? JSON.parse(storedSubscriptions) : [];
    subscriptions.push(newSubscription);
    await AsyncStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    navigation.goBack();
  };

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
    subscriptions[index] = { ...subscription, name, amount, monthlyCost: getMonthlyCost(amount), selectedMonthIndex1, selectedMonthIndex2, selectedTypeIndex};
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

  const getMonthlyCost = (cost) => {
    let monthlyCost = Array(12).fill(0);
    if (selectedTypeIndex === 0) { // Monthly
      monthlyCost = Array(12).fill(+((cost/12).toFixed(2)));
    } else {
      let divIndex;
      if (selectedTypeIndex === 1) divIndex = 6; // Biannual
      if (selectedTypeIndex === 2) divIndex = 12; // Annual

      monthlyCost = Array(12).fill(0);
      let monthCost = +((cost/divIndex).toFixed(2));
      let monthIndex;
      if (selectedMonthIndex1 !== undefined) { // Starting month < 6
        monthIndex = selectedMonthIndex1;
      } else if (selectedMonthIndex2 !== undefined) { // Starting month >= 6
        monthIndex = selectedMonthIndex2 + 6;
      }
      for (let j = 0; j < divIndex; j++) {
        monthlyCost[monthIndex] = monthCost;
        monthIndex ++;
        if (monthIndex > 11) {
          monthIndex = 0;
        }
      }

    }
    return monthlyCost;
  }

  const setMonthSelection = (selectedMonthGroup, value) => {
    if (selectedMonthGroup === 1) {
      setSelectedMonthIndex1(value);
      setSelectedMonthIndex2(undefined);
    } else if (selectedMonthGroup === 2) {
      setSelectedMonthIndex1(undefined);
      setSelectedMonthIndex2(value);
    }
  }

  useEffect(() => {
    validateForm();
  }, [name, amount, selectedTypeIndex, selectedMonthIndex1, selectedMonthIndex2]);

  const validateForm = () => {
      let errors = {};
      // const dateRegex = /^(0[1-9]|1[0-2])\/([0-2][0-9]|3[0-1])$/;

      if (!name) {
          errors.name = 'Name is required.';
      }

      if (!amount) {
          errors.amount = 'Monthly Cost is required.';
      } else if (!/^\d*\.?\d*$/.test(amount)) {
          errors.amount = 'Monthly Cost format is invalid.';
      }

      setErrors(errors);
      setIsFormValid(Object.keys(errors).length === 0);
  };

  const renderNewSubscriptionActions = () => {
    return (
      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
        <Button title="Add Subscription" onPress={addSubscription} />
      </View>
    );
  }

  const renderEditSubscriptionActions = () => {
    return (
      <View style={styles.buttonRow}>
        <Button title="Delete Subscription" onPress={deleteSubscription} />
        <Button title="Update Subscription" onPress={updateSubscription} />
      </View>
    );
  }

  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <View style={styles.container}>
        <Input
          placeholder="Description"
          onChangeText={value => setName(value)}
          value={name}
          errorMessage={!initialRender && errors.name}
        />
        <ButtonGroup
          selectedIndex={selectedTypeIndex}
          buttons={SUBSCRIPTIONS_TYPES}
          onPress={(index) => setSelectedTypeIndex(index)}
          containerStyle={{ marginBottom: 20 }}
        />
        <Input
          placeholder="Cost ($)"
          onChangeText={value => setAmount(value)}
          value={amount}
          errorMessage={!initialRender && errors.amount}
        />
        <Text style={{color: 'grey'}}>Starting Month</Text>
        <ButtonGroup
          selectedIndex={selectedMonthIndex1}
          buttons={MONTHS.slice(0, 6).map(month => month.substring(0, 3))}
          onPress={(index) => setMonthSelection(1, index)}
          containerStyle={{ marginBottom: 20 }}
        />
        <ButtonGroup
          selectedIndex={selectedMonthIndex2}
          buttons={MONTHS.slice(6, 12).map(month => month.substring(0, 3))}
          onPress={(index) => setMonthSelection(2, index)}
          containerStyle={{ marginBottom: 20 }}
        />

        {subscription ? renderEditSubscriptionActions() : renderNewSubscriptionActions()}
      </View>
      <View style={{flex:1, flexDirection: 'row', justifyContent: 'center',}}>
              <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                onAdFailedToLoad={error => console.log(error)}
            />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    height: '99%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
  },
});