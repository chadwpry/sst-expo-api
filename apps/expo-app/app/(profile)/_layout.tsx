import { Tabs } from 'expo-router';

export default function PrivateLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{
        headerShown: false,
        headerShadowVisible: false,
        href: null,
        title: '',
      }} />
      <Tabs.Screen name="edit" options={{
        headerShown: false,
        headerShadowVisible: false,
        href: null,
        title: '',
      }} />
    </Tabs>
  );
}
