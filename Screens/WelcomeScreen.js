import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import Background from './Background';
import Btn from './Btn';
import { darkGreen, green } from './Constants';

const WelcomeScreen = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1500, 
        useNativeDriver: true,
      }
    );

    const fadeOut = Animated.timing(
      fadeAnim,
      {
        toValue: 0,
        duration: 1500, 
        useNativeDriver: true,
      }
    );

    const sequence = Animated.sequence([fadeIn, Animated.delay(1000), fadeOut, Animated.delay(1000)]);

    const loop = Animated.loop(sequence);
    loop.start();

    return () => loop.stop();
  }, [fadeAnim]);

  return (
    <Background>
      <View style={{ marginHorizontal: 40, marginVertical: 100 }}>
        <Animated.Text style={[styles.appName, { opacity: fadeAnim }]}>TutorLinkHUB</Animated.Text>
        <Animated.Text style={[styles.appDescription, { opacity: fadeAnim }]}>Tuition Management App</Animated.Text>
        <Btn bgColor={green} textColor='white' btnLabel="Login" Press={() => props.navigation.navigate("LoginScreen")} />
        <Btn bgColor='white' textColor={darkGreen} btnLabel="Signup" Press={() => props.navigation.navigate("SignupScreen")} />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  appName: {
    color: 'yellow',
    fontSize: 43,
    fontWeight: 'bold',
    marginTop: 90,
    textAlign: 'center'
  },
  appDescription: {
    color: 'lightblue',
    fontSize: 29,
    marginTop: 20,
    marginBottom: 90,
    textAlign: 'center'
  }
});

export default WelcomeScreen;
