import React from 'react';
import {View} from 'react-native';
import MyStack from './src/navigation/index';

const App = () => {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <MyStack />
    </View>
  );
};

export default App;
