import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Lock } from '@tamagui/lucide-icons';
import { Button, View } from 'tamagui';
import { router } from 'expo-router';

import { authorize, useAuthenticationRequest } from '@/services/Authentication';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [request, response, promptAsync] = useAuthenticationRequest();

  React.useEffect(() => {
    const onLoad = async () => {
      if (response) {
        if (response.error) {
          alert(
            'Authentication error',
            response.params.error_description || 'something went wrong'
          );

          return;
        }

        if (response.type === 'success') {
          const authorizeResponse = await authorize(response.params.code, request?.codeVerifier);

          if (authorizeResponse) {
            router.replace('/(authenticated)');
          }
        }
      }
    }

    onLoad();
  }, [request, response]);

  return (
    <View alignItems="center" justifyContent="center" h="100%" w="100%">
      <Button alignSelf="center" disabled={!request} iconAfter={Lock} onPress={() => promptAsync()} size="$6">
        Login
      </Button>
    </View>
  );
}
