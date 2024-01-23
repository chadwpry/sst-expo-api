import { useState } from 'react';
import { Avatar, Button, Input, Label, Spinner, View, XStack, YStack } from '@components';
import { Save } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuthentication } from '@services/Authentication';
import * as ProfileService from '@services/Profile';

export default function ProfileEditScreen() {
  const {isLoading, profile, profileUpdate} = useAuthentication();
  const router = useRouter();

  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [profilePicture, setProfilePicture] = useState(profile?.profilePicture || '');

  const handleCancel = () => {
    router.back();
  }

  const handleSave = async () => {
    const changes: ProfileService.ProfileType = {
      firstName,
      lastName,
      email,
      profilePicture,
    };

    const result = await profileUpdate(changes);

    if (result) {
      router.replace('..');
    }
  }

  const handleProfilePicture = async () => {
    console.log('@TODO: handle logic to capture image and send to ProfileService');
    
    const permissionResponse = await requestPermission();

    if (permissionResponse.granted) {
      const result = await ImagePicker.launchCameraAsync();

      console.log(result);
    }

    console.log('canAskAgain', permissionResponse.canAskAgain);
    console.log('expires', permissionResponse.expires);
    console.log('granted', permissionResponse.granted);
    console.log('status', permissionResponse.status);
  }

  return (
    <View>
      <YStack mt="$6">
        <Avatar circular onPress={handleProfilePicture} size="$10">
          <Avatar.Image
            accessibilityLabel={`${profile?.firstName} ${profile?.lastName}`}
            src={profile?.profilePicture}
          />
          <Avatar.Fallback ai="center" bc="#ffffff" jc="center" />
        </Avatar>

        <Button onPress={handleProfilePicture}>Edit</Button>
      </YStack>

      <YStack mt="$4" paddingHorizontal="$4" w="100%">
        <YStack>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            defaultValue={profile?.firstName}
            id="firstName"
            maxLength={50}
            onChangeText={setFirstName}
            placeholder="First Name" />

          <Label htmlFor="lastName">Last Name</Label>
          <Input
            defaultValue={profile?.lastName}
            id="lastName"
            maxLength={50}
            onChangeText={setLastName}
            placeholder="Last Name" />
        </YStack>

        <YStack mt="$4">
          <Label htmlFor="email">Email</Label>
          <Input
            defaultValue={profile?.email}
            disabled={true}
            id="email"
            maxLength={50}
            onChangeText={setEmail}
            placeholder="Email" />
        </YStack>

      </YStack>

      <XStack marginHorizontal="$10">
        <Button
          gap={5}
          mt="$6"
          onPress={handleCancel}
        >
          Cancel
        </Button>

        <Button
          gap={5}
          iconAfter={isLoading ? <Spinner /> : Save}
          mt="$6"
          onPress={handleSave}
        >
          Save
        </Button>
      </XStack>
    </View>
  );
}