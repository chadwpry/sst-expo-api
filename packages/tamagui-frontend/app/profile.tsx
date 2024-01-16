import { Button, View } from 'tamagui';
import { Lock } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { revoke } from '@/services/Authentication';

export default function ProfileScreen() {
  const logout = async () => {
    const result = await revoke();

    if (result) {
      router.replace('/login');
    }
  };

  return (
    <View alignItems="center" justifyContent="center" h="100%" w="100%">
      <Button alignSelf="center" iconAfter={Lock} onPress={() => logout()} size="$6">
        Logout
      </Button>
    </View>
  );
}
