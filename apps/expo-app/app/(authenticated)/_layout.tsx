import { Avatar } from '@components';
import { View } from 'tamagui';
import { Code, Home } from '@tamagui/lucide-icons';
import { Tabs, useRouter } from 'expo-router';

import { useAuthentication } from '@services/Authentication';

export default function PrivateLayout() {
  const { profile } = useAuthentication();
  const router = useRouter();

  const navigateToProfile = () => {
    router.navigate('/(profile)');
  }

  return (
    <View height="100%" pl="$3" pr="$3">
      <Tabs screenOptions={{
        headerShown: true,
      }}>
        <Tabs.Screen
          name="index"
          options={{
            headerLeft: () => <Avatar onPress={navigateToProfile}>
              <Avatar.Image accessibilityLabel={`${profile?.firstName} ${profile?.lastName}`} src={profile?.profilePicture} />
            </Avatar>,
            tabBarIcon: ({ color }) => <Home color={color} />,
            title: 'Feed',
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            tabBarIcon: ({ color }) => <Code color={color} />,
            title: 'Tab Two',
          }}
        />
      </Tabs>
    </View>
  );
}
