import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import MainScreen from './screens/MainScreen';
import NewSubscriptionScreen from './screens/NewSubscriptionScreen';
import EditSubscriptionScreen from './screens/EditSubscriptionScreen';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'x';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={{flex:1}}>
      <NavigationContainer style={{flex:1}}>
        <Stack.Navigator>
          <Stack.Screen name="Subscriptions Tracker" component={MainScreen} />
          <Stack.Screen name="New Subscription" component={NewSubscriptionScreen} />
          <Stack.Screen name="Edit Subscription" component={EditSubscriptionScreen} />
        </Stack.Navigator>
        <View>
            <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              onAdFailedToLoad={error => console.log(error)}
          />
      </View>
      </NavigationContainer>
    </View>
  );
}