import { useEffect } from 'react';
import { Pressable } from 'react-native';
import { Avatar, Text } from 'tamagui';
import { Link, router, Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { getIdToken } from '@/services/Authentication';

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

  useEffect(() => {
    const onLoad = async () => {
      const result = await getIdToken();

      if (!result) {
        router.replace('/login');
      }
    }

    onLoad();
  }, []);

  const createProfileAvatar = () => (
    <Avatar circular ml="$2" size="$3">
      <Avatar.Fallback ai="center" bc="#ff0000" jc="center">
        <Text color="#ffffff" fontSize="$5">P</Text>
      </Avatar.Fallback>
    </Avatar>
  )

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerLeft: () => (
            <Link href="/profile" asChild>
              <Pressable>
                {({ pressed }) => createProfileAvatar()}
              </Pressable>
            </Link>
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
