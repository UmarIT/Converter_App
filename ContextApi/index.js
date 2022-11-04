import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';

const MyContext = React.createContext();

const MyProvider = ({children}) => {
  const [lbs, setLbs] = useState(0);
  const [kg, setKg] = useState(0);
  const [feet, setFeet] = useState(0);
  const [inch, setInch] = useState(0);
  const [meter, setMeter] = useState(0);
  const [check, setCheck] = useState('false');
  const AsyncCall = async () => {
    let value = await AsyncStorage.getItem('MyValue');

    setCheck(value);
  };

  useEffect(() => {
    AsyncCall();
  }, [AsyncStorage]);

  return (
    <MyContext.Provider
      value={{
        lbs,
        setLbs,
        kg,
        setKg,
        feet,
        setFeet,
        inch,
        setInch,
        meter,
        setMeter,
        check,
      }}>
      {children}
    </MyContext.Provider>
  );
};

export {MyContext, MyProvider};
