import { useState } from 'react';
import { Avatar, Button, Input, Label, Separator, Spinner, Text, View, XStack, YStack } from 'tamagui';
import { Save } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useAuthentication } from '@/services/Authentication';
import * as ProfileService from '@/services/Profile';

export default function ProfileEditScreen() {
  const {profile, updateProfile} = useAuthentication();
  const router = useRouter();

  const [isLoading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [profilePicture, setProfilePicture] = useState(profile?.profilePicture || '');

  const handleCancel = () => {
    router.back();
  }

  const handleSave = async () => {
    setLoading(true);

    const newProfile = {
      firstName,
      lastName,
      email,
      profilePicture,
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

  const handleProfilePicture = () => {
  }

  return (
    <View
      alignItems="center"
      backgroundColor="#ffffff"
      h="100%"
      justifyContent="center"
    >
      <YStack mt="$6">
        <Avatar circular onPress={handleProfilePicture} size="$10">
          <Avatar.Image
            accessibilityLabel={`${profile?.firstName} ${profile?.lastName}`}
            src={profile?.profilePicture}
          />
          <Avatar.Fallback ai="center" bc="#ffffff" jc="center" />
        </Avatar>

        <Button backgroundColor="white">Edit</Button>
      </YStack>

      <YStack mt="$4" paddingHorizontal="$4" w="100%">
        <YStack>
          <Label color="grey" fontSize="$5">Name</Label>
          <Input
            borderBottomLeftRadius={0}
            borderBottomRightRadius={0}
            color="black"
            defaultValue={profile?.firstName}
            fontSize="$5"
            maxLength={50}
            onChangeText={setFirstName}
            placeholder="First Name"
            size="$6" />

          <Input
            borderTopLeftRadius={0}
            borderTopRightRadius={0}
            color="black"
            defaultValue={profile?.lastName}
            fontSize="$5"
            maxLength={50}
            onChangeText={setLastName}
            placeholder="Last Name"
            size="$6" />
        </YStack>

        <YStack mt="$4">
          <Label color="grey">Email</Label>
          <Input
            color="black"
            defaultValue={profile?.email}
            fontSize="$5"
            maxLength={50}
            onChangeText={setEmail}
            padding="$2"
            placeholder="Email"
            size="$6" />
        </YStack>

      </YStack>

      <XStack>
        <Button borderWidth="1" backgroundColor="transparent" borderColor="#dedede" fontSize="$6" mt="$14" onPress={handleCancel}>
          Cancel
        </Button>

        <Button borderWidth="1" backgroundColor="transparent" borderColor="#dedede" fontSize="$6" mt="$14" onPress={handleSave}>
          Save
        </Button>
      </XStack>
    </View>
  );
}