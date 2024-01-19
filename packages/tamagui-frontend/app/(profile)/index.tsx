import { Avatar, Button, H3, Separator, Spinner, View, XStack } from 'tamagui';
import { Lock } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useAuthentication } from '@/services/Authentication';

export default function ProfileScreen() {
  const {isLoading, profile, signOut} = useAuthentication();

  const handleLogout = async () => {
    signOut();
  };

  const navigateToProfileEdit = async () => {
    router.push('/(profile)/edit');
  }

  return (
    <View alignItems="center" backgroundColor="#ffffff" justifyContent="center" h="100%" w="100%">
      <Avatar circular size="$10">
        <Avatar.Image
          accessibilityLabel={`${profile?.firstName} ${profile?.lastName}`}
          src={profile?.profilePicture}
        />
        <Avatar.Fallback ai="center" bc="#ffffff" jc="center" />
      </Avatar>

      <H3 mt="$6">{`${profile?.firstName || ''} ${profile?.lastName || ''}`}</H3>

      <XStack marginHorizontal="$10">
        <Button
          borderWidth="1"
          backgroundColor="transparent"
          borderColor="#dedede"
          mt="$14"
          onPress={() => navigateToProfileEdit()}
          size="$5"
        >
          Edit Profile
        </Button>

        <Separator />

        <Button
          borderWidth="1"
          backgroundColor="transparent"
          borderColor="#dedede"
          iconAfter={isLoading ? <Spinner color="$orange10" /> : Lock}
          mt="$14"
          onPress={() => handleLogout()}
          size="$5"
        >
          Logout
        </Button>
      </XStack>
    </View>
  );
}
