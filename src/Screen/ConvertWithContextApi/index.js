import React, {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import SwitchSelector from 'react-native-switch-selector';
import {MyContext} from '../../../ContextApi';
import {hp, wp} from '../../util';
const ConvertWithContext = () => {
  const options = [
    {label: 'Imperial', value: 'Imperial'},
    {label: 'Metric', value: 'Metric'},
  ];

  const {
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
    // setCheck,
  } = useContext(MyContext);
  const state = useContext(MyContext);
  const requestWritePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Write File Permission',
          message:
            'Cool Test App needs access to your Write File ' +
            'so you can Write File.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Write File permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const requestReadPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool Read File Permission',
          message:
            'Cool Test App needs access to your Read File ' +
            'so you can Write File.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        console.log('Write File permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (check == 'true') {
      readsFile();
    } else {
      AsyncStorage.setItem('MyValue', 'false');
    }
  }, [check]);

  const readsFile = async () => {
    if (Platform.OS == 'android') {
      let res = await requestReadPermission();

      if (res == true) {
        RNFS.readDir(RNFS.DownloadDirectoryPath)
          .then(result => {
            return Promise.all([RNFS.stat(result[0].path), result[0].path]);
          })
          .then(statResult => {
            if (statResult[0].isFile()) {
              return RNFS.readFile(statResult[1], 'utf8');
            }
            return 'no file';
          })
          .then(contents => {
            let temp = JSON.stringify(contents).split(',');

            let tempData = [];

            temp.map(item => {
              let res = item.split(':');
              let res2 = res[1];
              tempData.push(res2);
            });

            setLbs(tempData[0]);
            setFeet(tempData[1]);
            setInch(tempData[2]);
            setKg(tempData[3]);
            setMeter(tempData[4]);
          })
          .catch(err => {
            console.log(err.message, err.code);
          });
      }
    }
  };

  const writeFile = async () => {
    if (Platform.OS == 'android') {
      let res = await requestWritePermission();

      if (res == true) {
        var path = RNFS.DownloadDirectoryPath + '/testingApp.txt';

        RNFS.writeFile(
          path,
          `lbs : ${lbs} , feet:${feet},  inch:${inch} ,After convert Kg is :${kg},After Convert meter is :${meter}`,
          'utf8',
        )

          .then(() => {
            AsyncStorage.setItem('MyValue', 'true');
            Alert.alert(
              'Data is written in test.txt File check in Download folder',
            );
          })
          .catch(err => console.log('second', err.message));
      }
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headingStyle}>Unit convertor (With hooks)</Text>

      {show ? (
        <>
          <View style={styles.topInputContainer}>
            <TextInput
              style={styles.textInput}
              value={lbs.toString()}
              onChangeText={value => setLbs(value)}
              placeholderTextColor={'#fff'}
              keyboardType="numeric"
            />
            <Text style={styles.textStyle}>lbs</Text>
          </View>
          <View style={styles.bottomInputContainer}>
            <TextInput
              style={styles.textInputBottom}
              value={feet.toString()}
              onChangeText={value => setFeet(value)}
              keyboardType="numeric"
              placeholderTextColor={'#fff'}
            />
            <Text style={styles.textStyle}>ft</Text>
            <TextInput
              style={styles.textInputBottom}
              onChangeText={value => setInch(value)}
              keyboardType="numeric"
              value={inch.toString()}
              placeholderTextColor={'#fff'}
            />
            <Text style={styles.textStyle}>ln</Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.topInputContainer}>
            <TextInput
              style={styles.textInput}
              value={kg}
              onChangeText={value => setKg(value)}
              keyboardType="numeric"
              placeholderTextColor={'#fff'}
            />
            <Text style={styles.kgStyle}>kg</Text>
          </View>
          <View style={styles.topInputContainer}>
            <TextInput
              style={styles.textInput}
              value={meter}
              onChangeText={value => setMeter(value)}
              keyboardType="numeric"
              placeholderTextColor={'#fff'}
            />
            <Text style={styles.textMeter}>m</Text>
          </View>
        </>
      )}

      <SwitchSelector
        options={options}
        initial={0}
        onPress={value => {
          if (value == 'Metric') {
            setKg((lbs * 0.453592).toFixed(2));
            let tempInch = feet * 12;
            tempInch = parseFloat(tempInch) + parseFloat(inch);
            setMeter((tempInch * 0.0254).toFixed(2));
            setShow(false);
          } else {
            let temp = (meter / 0.3048).toFixed(2);
            let tempInch = temp - temp.split('.')[0];
            tempInch = tempInch.toFixed(2) * 12;
            setFeet(temp.split('.')[0]);
            setInch(parseInt(tempInch));
            setLbs((kg / 0.45359).toFixed(3));
            setShow(true);
          }
        }}
        style={{
          width: wp(87),
          marginTop: hp(2),
        }}
        borderRadius={hp(2)}
        buttonColor={'green'}
      />
      <TouchableOpacity
        style={styles.saveToDiskContainerStyle}
        onPress={() => {
          if (feet == 0 || inch == 0 || kg == 0 || lbs == 0 || meter == 0) {
            Alert.alert('Please fill all the field.');
          } else {
            writeFile();
          }
        }}>
        <Text style={styles.savetoDisk}>Save to disk</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setFeet(0);
          setInch(0);
          setLbs(0);
          setKg(0);
          setMeter(0);
          AsyncStorage.setItem('MyValue', 'false');
        }}>
        <Text style={styles.resetStyle}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConvertWithContext;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingStyle: {
    color: '#fff',
    marginBottom: hp(1),
  },
  textStyle: {
    color: '#fff',
    padding: hp(2),
  },
  resetStyle: {
    color: 'blue',
    marginTop: hp(1),
  },
  textInput: {
    borderColor: '#fff',
    borderWidth: 1,
    width: wp(77),
    borderRadius: hp(4),
    color: '#fff',
    height: hp(5),
    paddingLeft: hp(2),
  },
  textInputBottom: {
    borderColor: '#fff',
    borderWidth: 1,
    width: wp(31),
    borderRadius: hp(4),
    color: '#fff',
    height: hp(5),
    paddingLeft: hp(2),
  },
  topInputContainer: {
    flexDirection: 'row',
  },
  bottomInputContainer: {
    flexDirection: 'row',
    // marginTop: hp(2),
    justifyContent: 'space-around',
  },
  saveToDiskContainerStyle: {
    width: wp(45),
    height: hp(4),
    backgroundColor: 'green',
    borderRadius: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  textMeter: {
    color: '#fff',
    padding: hp(1.5),
  },
  savetoDisk: {
    color: '#fff',
  },
  kgStyle: {
    color: '#fff',
    padding: hp(1.5),
    marginTop: hp(1),
  },
});
