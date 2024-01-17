import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Lock } from '@tamagui/lucide-icons';
import { Button, Spinner, View } from 'tamagui';

import { get as getProfile } from '@/services/Profile';
import { authorize, useAuthentication, useAuthenticationRequest } from '@/services/Authentication';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [isLoading, setLoading] = useState(false);
  const [request, response, promptAsync] = useAuthenticationRequest();
  const { login } = useAuthentication();

  const handleLogin = () => {
    setLoading(true);
    promptAsync();
  }

  useEffect(() => {
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
          if (!request?.codeVerifier) {
            throw new Error('Missing code verifier in authentication/authorization request');
          }

          const authorizeResponse = await authorize(response.params.code, request?.codeVerifier || '');

          if (authorizeResponse) {
            const profile = await getProfile();

            if (profile) {
              login(profile);
            }
          }
        }
      }
    }

    onLoad();
  }, [request, response]);

  return (
    <View alignItems="center" justifyContent="center" h="100%" w="100%">
      <Button alignSelf="center" disabled={!request} iconAfter={isLoading ? <Spinner color="$orange10" /> : Lock} onPress={() => handleLogin()} size="$6">
        Login
      </Button>
    </View>
  );
}
