import { View } from 'tamagui';
import { Link, Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function PrivateLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        headerRight: () => (
          <View mr="$4">
            <Link href="../">
              <FontAwesome name="close" size={28} />
            </Link>
          </View>
        ),
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerShadowVisible: false,
        href: null,
        title: '',
      }} />
      <Tabs.Screen name="edit" options={{
        headerShown: false,
        href: null,
        title: '',
      }} />
    </Tabs>
  );
}
