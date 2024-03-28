import React from 'react';
import { Stack } from 'expo-router';

const EmailAuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Sign-in',
        }}
      />
      <Stack.Screen
        name="email_signup"
        options={{
          title: 'Register',
        }}
      />
    </Stack>
  );
};

export default EmailAuthLayout;
