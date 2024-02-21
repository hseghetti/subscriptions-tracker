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
        <Stack.Screen name=" " component={MainScreen} />
        <Stack.Screen name="New Subscription" component={NewSubscriptionScreen} />
        <Stack.Screen name="Edit Subscription" component={EditSubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}