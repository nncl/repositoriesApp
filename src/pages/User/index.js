import React from 'react';
import { View } from 'react-native';

export default function User({ navigation }) {
  console.log('navigation', navigation.getParam('user'));
  return <View />;
}
