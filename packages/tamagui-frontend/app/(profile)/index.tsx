import { useState } from 'react';
import { Avatar, Button, H3, Spinner, View, XStack } from 'tamagui';
import { Lock } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useAuthentication } from '@/services/Authentication';

export default function ProfileScreen() {
  const [isLoading, setLoading] = useState(false);
  const {profile, logout} = useAuthentication();

  const handleLogout = async () => {
    setLoading(true);
    logout();
    setLoading(false);
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

      <XStack>
        <Button
          borderWidth="1"
          backgroundColor="transparent"
          borderColor="#dedede"
          fontSize="$6"
          mt="$14"
          onPress={() => navigateToProfileEdit()}
        >
          Edit Profile
        </Button>

        <Button
          borderWidth="1"
          backgroundColor="transparent"
          borderColor="#dedede"
          fontSize="$6"
          iconAfter={isLoading ? <Spinner color="$orange10" /> : Lock}
          mt="$14"
          onPress={() => handleLogout()}
        >
          Logout
        </Button>
      </XStack>
    </View>
  );
}
