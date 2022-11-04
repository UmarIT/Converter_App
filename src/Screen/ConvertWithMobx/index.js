import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {hp, wp} from '../../util';
import SwitchSelector from 'react-native-switch-selector';
import CalculationStore from '../../../MobxStore/mobxStore';
import {observer} from 'mobx-react';
import * as RNFS from 'react-native-fs';

const ConvertWithMobx = () => {
  const options = [
    {label: 'Imperial', value: 'Imperial'},
    {label: 'Metric', value: 'Metric'},
  ];

  useEffect(() => {
    if (CalculationStore.check == 'true') {
      readsFile();
    } else {
      CalculationStore.setCheck('false');
    }
  }, [CalculationStore.check]);

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

            CalculationStore.setLbs(tempData[0]);
            CalculationStore.setFeet(tempData[1]);
            CalculationStore.setInch(tempData[2]);
            CalculationStore.setKg(tempData[3]);
            CalculationStore.setMeter(tempData[4]);
          })
          .catch(err => {
            console.log(err.message, err.code);
          });
      }
    }
  };

  const [show, setShow] = useState(true);
  const writeFile = async () => {
    if (Platform.OS == 'android') {
      let res = await requestWritePermission();

      if (res == true) {
        var path = RNFS.DownloadDirectoryPath + '/testingApp1.txt';
        RNFS.writeFile(
          path,
          `lbs : ${CalculationStore.lbs} , feet:${CalculationStore.feet},  inch:${CalculationStore.inch} ,After convert Kg is :${CalculationStore.kg}, After Convert meter is :${CalculationStore.meter}  `,
          'utf8',
        )

          .then(() => {
            CalculationStore.setCheck('true');
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
              value={CalculationStore.lbs.toString()}
              onChangeText={value => CalculationStore.setLbs(value)}
              placeholderTextColor={'#fff'}
              keyboardType="numeric"
            />
            <Text style={styles.textStyle}>lbs</Text>
          </View>
          <View style={styles.bottomInputContainer}>
            <TextInput
              style={styles.textInputBottom}
              value={CalculationStore.feet.toString()}
              onChangeText={value => CalculationStore.setFeet(value)}
              keyboardType="numeric"
              placeholderTextColor={'#fff'}
            />
            <Text style={styles.textStyle}>ft</Text>
            <TextInput
              style={styles.textInputBottom}
              onChangeText={value => CalculationStore.setInch(value)}
              keyboardType="numeric"
              value={CalculationStore.inch.toString()}
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
              value={CalculationStore.kg.toString()}
              onChangeText={value => CalculationStore.setKg(value)}
              keyboardType="numeric"
              placeholder={`${CalculationStore.kg}`}
              placeholderTextColor={'#fff'}
            />
            <Text style={styles.kgStyle}>kg</Text>
          </View>
          <View style={styles.topInputContainer}>
            <TextInput
              style={styles.textInput}
              value={CalculationStore.meter.toString()}
              onChangeText={value => CalculationStore.setMeter(value)}
              keyboardType="numeric"
              placeholderTextColor={'#fff'}
            />
            <Text style={styles.styleMeter}>m</Text>
          </View>
        </>
      )}

      <SwitchSelector
        options={options}
        initial={0}
        onPress={value => {
          if (value == 'Metric') {
            CalculationStore.convertLbstoKg();
            CalculationStore.convertFeet();

            setShow(false);
          } else {
            CalculationStore.convertKgToLbs();
            CalculationStore.convertMeter();
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
        onPress={() => {
          if (
            CalculationStore.feet == 0 ||
            CalculationStore.inch == 0 ||
            CalculationStore.kg == 0 ||
            CalculationStore.lbs == 0 ||
            CalculationStore.meter == 0
          ) {
            Alert.alert('Please fill all the field.');
          } else {
            writeFile();
          }
        }}
        style={styles.saveToDiskContainerStyle}>
        <Text style={styles.savetoDisk}>Save to disk</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          CalculationStore.setLbs(0);
          CalculationStore.setFeet(0);
          CalculationStore.setInch(0);
          CalculationStore.setKg(0);
          CalculationStore.setMeter(0);
          CalculationStore.setCheck('false');
        }}>
        <Text style={styles.resetStyle}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

export default observer(ConvertWithMobx);

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
    margin: hp(2),
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
  kgStyle: {
    color: '#fff',
    padding: hp(1.5),
    marginTop: hp(1),
  },
  styleMeter: {
    color: '#fff',
    padding: hp(1.5),
  },
  savetoDisk: {
    color: '#fff',
  },
});
