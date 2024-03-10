import React, { useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { Text, Button, lightColors, createTheme, ThemeProvider, ListItem } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";

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
    { label: "January", value: 0 },
    { label: "February", value: 1 },
    { label: "March", value: 2 },
    { label: "April", value: 3 },
    { label: "May", value: 4 },
    { label: "June", value: 5 },
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
    { label: "November", value: 10 },
    { label: "December", value: 11 },
  ];
  const [value, setValue] = useState(months[new Date().getMonth()].value);
  const SUBSCRIPTIONS_TYPES = ["Monthly", "Biannual", "Annual"];

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const storedSubscriptions = await AsyncStorage.getItem("subscriptions");
        if (storedSubscriptions) {
          // check if subscriptions is different from storedSubscriptions
          if (JSON.stringify(subscriptions) !== storedSubscriptions) setSubscriptions(JSON.parse(storedSubscriptions));
        } else setSubscriptions([]);
      })();
    }
    , [subscriptions])
  );

  useEffect(() => {
    (async () => {
      const storedSubscriptions = await AsyncStorage.getItem("subscriptions");
      if (storedSubscriptions) {
        console.log(JSON.stringify(subscriptions) !== storedSubscriptions);
        // check if subscriptions is different from storedSubscriptions
        if (JSON.stringify(subscriptions) !== storedSubscriptions) setSubscriptions(JSON.parse(storedSubscriptions));
      }
      else setSubscriptions([]);
    })();
  }, [subscriptions]);

  const calculateTotalMonthlyCost = (selectedMonth) => {
    if (subscriptions) {
      return subscriptions.reduce((acc, item) => {
        let month;
        if (item.selectedMonthIndex1) month = item.selectedMonthIndex1;
        else if (item.selectedMonthIndex2) month = item.selectedMonthIndex2 + 6;

        return item.selectedTypeIndex!==0 && month!==selectedMonth && item.monthlyCost ? acc + parseFloat(item.monthlyCost[month]) : 0; // ver los logs porque no está guardando el monthlyCost
      }, 0);
    }
  };

  const calculateTotalMonthlyPay = (selectedMonth) => {
    return subscriptions.reduce((acc, item) => {
      let month;
      if (item.selectedMonthIndex1) month = item.selectedMonthIndex1;
      else if (item.selectedMonthIndex2) month = item.selectedMonthIndex2 + 6;
      if (month === selectedMonth || item.selectedTypeIndex===0) {
        return acc + parseFloat(item.amount);
      }
      return acc;
    }, 0);
  };

  const getMonthName = (month) => {
    const monthObj = months.find((e) => e.value === month);

    return monthObj?.label || "";
  };

  const getSubsMonth = (monthIndex1, monthIndex2) => {
    if (monthIndex1 !== undefined) {
      return months[monthIndex1].label;
    } else if (monthIndex2 !== undefined) {
      return months[monthIndex2 + 6].label;
    }
  };

  const getMonthtlyCost = (item) => {
    if (item.selectedTypeIndex === 0) {
      return item.amount;
    }
    if (item.selectedTypeIndex === 1) {
      return (item.amount / 6).toFixed(2);
    }
    if (item.selectedTypeIndex === 2) {
      return (item.amount / 12).toFixed(2);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <View style={{ flex: 1,  flexDirection: "column", alignItems:'stretch'}}>
        <View>
          <View style={styles.titleRow}>
            <View style={{alignItems: 'stretch'}}>
              <Text style={{ fontWeight: "bold" }}>Monthly Subscriptions</Text>
              <View style={{ flexDirection: "row"}}>
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
                  style={styles.dropdown}
                />
                <View style={{ marginTop: 5, marginLeft: 20 }}>
                  <Button size="sm" title="New Subscription" onPress={() => navigation.navigate("New Subscription")} />
                </View>
              </View>
              <Text style={styles.subtitle}>
                Total to pay on {getMonthName(value)}: $ {value ? calculateTotalMonthlyPay(value) : "Select a month"}
              </Text>
              <Text style={styles.subtitle}>
                {getMonthName(value)} Suggested Saving: $ {value ? calculateTotalMonthlyCost(value) : "Select a month"}
              </Text>
              <Text style={styles.subtitle}>
                Subscriptions Total: $ {subscriptions.reduce((acc, item) => acc + parseFloat(item.amount), 0)}
              </Text>
            </View>

          </View>

            <FlatList
              data={subscriptions}
              renderItem={({ item }) => (
                <ListItem topDivider onPress={() => navigation.navigate("New Subscription", { subscription: item })}>
                  <ListItem.Content>
                    <ListItem.Title style={styles.itemTitle}>{item.name}</ListItem.Title>
                    <ListItem.Subtitle style={styles.itemDetail}>Subscription Cost ($): {item.amount}</ListItem.Subtitle>
                    <ListItem.Subtitle>Monthly Cost ($): {getMonthtlyCost(item)}</ListItem.Subtitle>
                    <ListItem.Subtitle>
                      Subscription Type: {SUBSCRIPTIONS_TYPES[item.selectedTypeIndex]}
                    </ListItem.Subtitle>
                    <ListItem.Subtitle>
                      First Month: {getSubsMonth(item.selectedMonthIndex1, item.selectedMonthIndex2)}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              )}
              keyExtractor={(item) => item.id}
            />
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    alignItems: 'stretch'
  },
  titleRow: {
    // flexDirection: "row",
    // justifyContent: "center",
    padding: 3,

  },
  subtitle: {
    paddingTop: 10,
    fontSize: 16,
    paddingBottom: 15,
    backgroundColor: "white",
    borderRadius: 8,
    margin: 2,
    paddingHorizontal: 3,
  },
  totalText: {
    paddingTop: 10,
    fontWeight: "bold",
    fontSize: 16,
    paddingBottom: 15,
    backgroundColor: "white",
    borderRadius: 8,
    margin: 5,
    paddingHorizontal: 10,
    // width: "20%",
  },
  textbox: {
    flexDirection: "row",
  },
  itemTitle: {
    fontWeight: "bold",
  },
  itemDetail: {
    color: "grey",
    fontWeight: "bold",
  },
  selectedTextStyle: {
    // borderWidth: 0.5,
    // borderColor: 'grey',
    paddingLeft: 10,
  },
  dropdown: {
    backgroundColor: "lightblue",
    margin: 3,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 150,
  },
});
