import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';

export const CustomButton = props => {
  return (
    <>
      {!props.loading ? (
        !props.disabled ? (
          <TouchableOpacity
            style={props.style[0]}
            onPress={props.onPress}
            hitSlop={props.hitSlop}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={props.style[1]}>{props.title1}</Text>
              {props.title2 && (
                <Text style={props.style[2]}>{props.title2}</Text>
              )}
            </View>
            {props.children && props.children}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled
            style={[props.style[0], styles.disabledButton]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={props.style[1]}>{props.title1}</Text>
              {props.title2 && (
                <Text style={props.style[2]}>{props.title2}</Text>
              )}
            </View>
            {props.children && props.children}
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity
          disabled
          style={[props.style[0]]}
          onPress={props.onPress}>
          <ActivityIndicator
            color={props.blackLoader ? styles.blackColor : styles.whiteColor}
          />
        </TouchableOpacity>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  blackColor: '#000',
  whiteColor: '#fff',
  disabledButton: {
    backgroundColor: '#cccc',
  },
});
