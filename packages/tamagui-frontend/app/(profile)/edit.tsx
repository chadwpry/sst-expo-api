import { useState } from 'react';
import { Avatar, Button, H3, Spinner, View } from 'tamagui';
import { Save } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useAuthentication } from '@/services/Authentication';
import * as ProfileService from '@/services/Profile';

export default function ProfileEditScreen() {
  const [isLoading, setLoading] = useState(false);
  const { profile, updateProfile } = useAuthentication();

  const save = async () => {
    setLoading(true);

    const newProfile = {
      name: profile?.name || '',
      email: profile?.email || '',
      profilePicture: profile?.profilePicture || '',
    };

    const response = await ProfileService.put(newProfile);

    if (response) {
      updateProfile(newProfile);

      setLoading(false);

      router.replace('..');
    } else {
      console.error("Failed to update profile", profile);
    }
  }

  return (
    <View alignItems="center" backgroundColor="#ffffff" justifyContent="center" h="100%" w="100%">
      <Avatar circular size="$10">
        <Avatar.Image
          accessibilityLabel={profile?.name}
          src={profile?.profilePicture}
        />
        <Avatar.Fallback ai="center" bc="#ffffff" jc="center" />
      </Avatar>

      <H3 mt="$6">{profile?.name}</H3>

      <Button
        borderWidth="1"
        backgroundColor="transparent"
        borderColor="#dedede"
        fontSize="$6"
        iconAfter={isLoading ? <Spinner color="$orange10" /> : Save}
        mt="$14"
        onPress={() => save()}
      >
        Save Profile
      </Button>
    </View>
  );
}