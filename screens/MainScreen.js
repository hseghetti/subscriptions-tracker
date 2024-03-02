import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Text, Button, lightColors, createTheme, ThemeProvider, ListItem } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';

const theme = createTheme({
  lightColors: {
    ...Platform.select({
      default: lightColors.platform.android,
      ios: lightColors.platform.ios,
    }),
  },
});

export default function MainScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];
  const [value, setValue] = useState(months[new Date().getMonth()].value);

  useEffect(() => {
    (async () => {
      const storedSubscriptions = await AsyncStorage.getItem('subscriptions');
      if (storedSubscriptions) setSubscriptions(JSON.parse(storedSubscriptions));
    })();
  }, [subscriptions]);

  const calculateTotalMonthlyCost = (selectedMonth) => {
    return subscriptions.reduce((acc, item) => {
      const [month, year] = item.renewalDate.split('/');
      if (month === selectedMonth) {
        return acc + parseFloat(item.amount);
      }
      return acc;
    }, 0);
  }

  const getMonthName = (month) => {
    const monthObj = months.find(e => (e.value === month));
    return monthObj.label || '';
  }

  return (
    <ThemeProvider theme={theme}>
      <View style={{ flex: 1,  justifyContent: 'center' }}>
        <View style={styles.titleRow}>
          <View>
            <Text>Monthly Subscriptions</Text>
            <Dropdown
              data={months}
              label="Select a month"
              onChange={(item) => {
                setValue(item.value);
              }}
              labelField="label"
              valueField="value"
              value={value}
              selectedTextStyle={styles.selectedTextStyle}
            />
            <Text style={styles.subtitle}>
              Total on {getMonthName(value)}: $ {value ? calculateTotalMonthlyCost(value) : "Select a month"}
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <Button size="sm" title="New Subscription"
              onPress={() => navigation.navigate("New Subscription")} />
              <Text style={styles.subtitle}>
              Annual Total: $ {subscriptions.reduce((acc, item) => acc + parseFloat(item.amount), 0)}
            </Text>
          </View>
        </View>
        <FlatList
          data={subscriptions}
          renderItem={({ item }) => (
            <ListItem topDivider onPress={() => navigation.navigate("Edit Subscription", { subscription: item })}>
              <ListItem.Content>
                <ListItem.Title style={styles.itemTitle}>{item.name}</ListItem.Title>
                <ListItem.Subtitle>Monthly Cost ($): {item.amount}</ListItem.Subtitle>
                <ListItem.Subtitle>Renew on: {item.renewalDate}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
  },
  subtitle: {
    paddingTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 15,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  selectedTextStyle: {
    borderWidth: 0.5,
    borderColor: 'grey',
  },
});