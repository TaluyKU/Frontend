import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '#src/auth/context/AuthContext';
import HomeScreen from '#src/screens/HomeScreen';
import MapScreen from '#src/screens/MapScreen';
import PlaceScreen from '#src/screens/PlaceScreen';
import SignInScreen from '#src/screens/SignInScreen';
import ProfileScreen from '#src/screens/ProfileScreen';
import SignUpScreen from '#src/screens/SignUpScreen';
import SearchScreen from '#src/screens/SearchScreen';
import AddPlaceScreen from '#src/screens/AddPlaceScreen';
import { Icon } from 'react-native-ui-lib';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const NavigationTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ size, focused, color }) => {
            return <Icon source={require('#assets/images/navigate/home.png')} size={20} />;
          },
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        initialParams={{ category: 'All' }}
        options={{
          headerShown: false,
          title: 'Map',
          tabBarIcon: ({ size, focused, color }) => {
            return <Icon source={require('#assets/images/navigate/map.png')} size={20} />;
          },
        }}
      />
      <Tab.Screen
        name="AddPlace"
        component={AddPlaceScreen}
        options={{
          headerShown: false,
          title: 'Add Place',
          tabBarIcon: ({ size, focused, color }) => {
            return <Icon source={require('#assets/images/navigate/addPlace.png')} size={20} />;
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          title: 'Search',
          tabBarIcon: ({ size, focused, color }) => {
            return <Icon source={require('#assets/images/navigate/search.png')} size={20} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ size, focused, color }) => {
            return <Icon source={require('#assets/images/navigate/profile.png')} size={20} />;
          },
        }}
      />
    </Tab.Navigator>
  );
};

const AppNav = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken !== null ? (
          <>
            <Stack.Screen name="Main" component={NavigationTab} options={{ headerShown: false }} />
            <Stack.Screen name="Place" component={PlaceScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: 'สมัครบัญชีใหม่' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
});

export default AppNav;
