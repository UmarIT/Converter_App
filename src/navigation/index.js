import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import ConvertWithMobx from '../Screen/ConvertWithMobx/index';
import ConvertWithContext from '../Screen/ConvertWithContextApi/index';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Text} from 'react-native';
import {hp, wp} from '../util';
import {MyProvider} from '../../ContextApi';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'green',
        },

        tabBarIconStyle: {
          display: 'none',
        },
      }}>
      <Tab.Screen
        name="CreateWithMobx"
        component={ConvertWithMobx}
        options={{
          tabBarLabel: 'Mobx',
          tabBarLabelStyle: {
            fontSize: wp(5),

            marginBottom: hp(1.5),
          },
          tabBarActiveTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="ConvertWithContext"
        component={ConvertWithContext}
        options={{
          tabBarLabel: 'Context',
          tabBarLabelStyle: {
            fontSize: wp(5),
            marginBottom: hp(1.5),
            width: wp(50),
          },
          tabBarActiveTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
}

const MyStack = () => {
  return (
    <MyProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="MyTabs" component={MyTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </MyProvider>
  );
};
export default MyStack;
