import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron.configure() // {host: <IP address>}
    .useReactNative()
    .connect();
  console.tron = tron;
  tron.clear(); // Clear timeline on every refresh
}
