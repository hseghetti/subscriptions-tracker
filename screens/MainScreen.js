import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MainScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    (async () => {
      const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
      if (storedSubscriptions) setSubscriptions(JSON.parse(storedSubscriptions));
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Subscriptions Tracker</Text>
      <Button title="New Subscription" onPress={() => navigation.navigate('NewSubscription')} />
      <FlatList
        data={subscriptions}
        renderItem={({ item }) => (
          <Text onPress={() => navigation.navigate('EditSubscription', { subscription: item })}>
            {item.name}, {item.amount}, {item.renewalDate}
          </Text>
        )}
        keyExtractor={(item) => item.id}
      />
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