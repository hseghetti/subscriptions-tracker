import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { View } from 'react-native';
import MainScreen from './screens/MainScreen';
import NewSubscriptionScreen from './screens/NewSubscriptionScreen';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'x';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={{flex:1, flexDirection: 'column'}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Subscriptions Tracker" component={MainScreen} options={{ animationEnabled: false, animation: 'none', }}/>
          <Stack.Screen name="New Subscription" component={NewSubscriptionScreen} options={{ animationEnabled: false, animation: 'none', }} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <View>
            <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              onAdFailedToLoad={error => console.log(error)}
          />
      </View> */}
    </View>
  );
}