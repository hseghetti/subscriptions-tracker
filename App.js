import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './screens/MainScreen';
import NewSubscriptionScreen from './screens/NewSubscriptionScreen';
import EditSubscriptionScreen from './screens/EditSubscriptionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="NewSubscription" component={NewSubscriptionScreen} />
        <Stack.Screen name="EditSubscription" component={EditSubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}