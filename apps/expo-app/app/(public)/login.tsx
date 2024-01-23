import * as WebBrowser from 'expo-web-browser';
import { Lock } from '@tamagui/lucide-icons';
import { Button, H3, Spinner, View } from '@components';

import { useAuthentication } from '@services/Authentication';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { isLoading, signIn } = useAuthentication();

  const handleSignIn = () => {
    signIn();
  }

  return isLoading ? (
    <View alignItems="center" justifyContent="center" h="100%" w="100%">
      <Spinner size="large" />
      <H3 fontSize="$6" mt="$4">Signing into the application</H3>
    </View>
  ) : (
    <View alignItems="center" justifyContent="center" h="100%" w="100%">
      <Button
        iconAfter={isLoading ? <Spinner /> : Lock}
        onPress={() => handleSignIn()}
      >
        Sign In
      </Button>
    </View>
  );
}
