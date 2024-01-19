import * as WebBrowser from 'expo-web-browser';
import { Lock } from '@tamagui/lucide-icons';
import { Button, Spinner, Text, View } from 'tamagui';

import { useAuthentication } from '@/services/Authentication';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { isLoading, signIn } = useAuthentication();

  const handleSignIn = () => {
    signIn();
  }

  return isLoading ? (
    <View alignItems="center" justifyContent="center" h="100%" w="100%">
      <Spinner color="$orange10" size="large" />
      <Text fontSize="$6" mt="$4">Signing into the application</Text>
    </View>
  ) : (
    <View alignItems="center" justifyContent="center" h="100%" w="100%">
      <Button
        borderWidth="1"
        backgroundColor="transparent"
        borderColor="#dedede"
        iconAfter={isLoading ? <Spinner color="$orange10" /> : Lock}
        onPress={() => handleSignIn()}
        size="$5"
      >
        SignIn
      </Button>
    </View>
  );
}
