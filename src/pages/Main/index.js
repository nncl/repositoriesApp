import React from 'react';
import { Text } from 'react-native';
import { Container } from './styles';

export default function Main() {
  return (
    <Container>
      <Text>Hello Users</Text>
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Users',
};
