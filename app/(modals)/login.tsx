import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SignInWithProvider = ({
  provider,
  buttonTitle,
  buttonColor,
  iconName,
}: {
  provider: string;
  buttonTitle: string;
  buttonColor: string;
  iconName: keyof typeof Ionicons.glyphMap;
}) => {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: `oauth_${provider}` });

  const handlePress = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>{buttonTitle}</Text>
      <Ionicons name={iconName} size={24} color="white" />
    </TouchableOpacity>
  );
};

const Login = () => {
  const router = useRouter();
  const emailSignupOnPress = () => {
    router.push('/(email_auth)');
  };
  return (
    <View style={styles.container}>
      <SignInWithProvider
        iconName="logo-google"
        provider="google"
        buttonTitle="Continue with Google"
        buttonColor="#DB4437"
      />
      <SignInWithProvider
        iconName="logo-apple"
        provider="apple"
        buttonTitle="Continue with Apple"
        buttonColor="#000000"
      />
      <SignInWithProvider
        iconName="logo-facebook"
        provider="facebook"
        buttonTitle="Continue with Facebook"
        buttonColor="#4267B2"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#007BFF' }]}
        onPress={emailSignupOnPress}
      >
        <Text style={styles.buttonText}>Continue with Email</Text>
        <Ionicons name="mail-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Nice background color
  },
  button: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25, // Rounded borders
    marginVertical: 5, // Space between buttons
    width: '100%', // Same width for all buttons
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Login;
