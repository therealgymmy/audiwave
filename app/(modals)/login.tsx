import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';

const SignInWithProvider = ({
  provider,
  buttonTitle,
  buttonColor,
}: {
  provider: string;
  buttonTitle: string;
  buttonColor: string;
}) => {
  const { startOAuthFlow } = useOAuth({ strategy: `oauth_${provider}` });

  const handlePress = async () => {
    try {
      await startOAuthFlow();
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
    </TouchableOpacity>
  );
};

export default function Login() {
  return (
    <View style={styles.container}>
      <SignInWithProvider
        provider="google"
        buttonTitle="Sign in with Google"
        buttonColor="#DB4437"
      />
      <SignInWithProvider provider="apple" buttonTitle="Sign in with Apple" buttonColor="#000000" />
      <SignInWithProvider
        provider="facebook"
        buttonTitle="Sign in with Facebook"
        buttonColor="#4267B2"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#007BFF' }]}
        onPress={() => {
          /* Navigate to your email sign-in screen here */
        }}
      >
        <Text style={styles.buttonText}>Sign in with Email</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5', // Nice background color
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25, // Rounded borders
    marginVertical: 5, // Space between buttons
    width: '100%', // Same width for all buttons
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
