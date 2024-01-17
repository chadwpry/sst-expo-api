import { DimensionValue, Pressable, TextStyle } from 'react-native';
import { Avatar, View } from 'tamagui';
import { Link, Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useAuthentication } from '@/services/Authentication';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function PrivateLayout() {
  const { profile } = useAuthentication();

  const createProfileAvatar = () => (
    <Avatar circular ml="$2" size="$3">
      <Avatar.Image accessibilityLabel={profile?.name} src={profile?.profilePicture} />
    </Avatar>
  )

  const paddingRight: DimensionValue = 10;

  const linkStyle: TextStyle = {
    paddingRight,
  }

  return (
    <Tabs screenOptions={{
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          headerLeft: () => (
            <View mr="$4">
              <Link style={linkStyle} href="/(profile)" asChild>
                <Pressable>
                  {({ pressed }) => createProfileAvatar()}
                </Pressable>
              </Link>
            </View>
          ),
          headerShown: true,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          title: 'Feed',
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          title: 'Tab Two',
        }}
      />
    </Tabs>
  );
}
