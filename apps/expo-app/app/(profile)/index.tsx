import { Avatar, Button, H3, Spinner, View, XStack } from '@components'
import { Lock } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useAuthentication } from '@services/Authentication';

export default function ProfileScreen() {
  const {isLoading, profile, signOut} = useAuthentication();

  const handleLogout = async () => {
    signOut();
  };

  const navigateToProfileEdit = async () => {
    router.push('/(profile)/edit');
  }

  return (
    <View>
      <Avatar size="$10">
        <Avatar.Image
          accessibilityLabel={`${profile?.firstName} ${profile?.lastName}`}
          src={profile?.profilePicture}
        />
        <Avatar.Fallback ai="center" bc="#ffffff" jc="center" />
      </Avatar>

      <H3 mt="$6">{`${profile?.firstName || ''} ${profile?.lastName || ''}`}</H3>

      <XStack marginHorizontal="$10">
        <Button
          gap={5}
          mt="$14"
          onPress={() => navigateToProfileEdit()}
        >
          Edit Profile
        </Button>

        <Button
          gap={5}
          iconAfter={isLoading ? <Spinner /> : Lock}
          mt="$14"
          onPress={() => handleLogout()}
        >
          Logout
        </Button>
      </XStack>
    </View>
  );
}
