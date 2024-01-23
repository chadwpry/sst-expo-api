import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';
import appConfig from '@tamagui.config';
import { X } from '@tamagui/lucide-icons';
import { Button } from '@components';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { AuthenticationProvider, useAuthentication } from '@services/Authentication';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontLoaded, fontError] = useFonts({
    // Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    // InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    // ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!fontLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const Screens = () => {
  const { isAuthenticated } = useAuthentication();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(authenticated)/');
    } else {
      router.replace('/(public)/login');
    }
  }, [isAuthenticated]);

  return (
    <Stack initialRouteName='(authenticated)' screenOptions={{
      contentStyle: { backgroundColor: "$background" },
    }}>
      <Stack.Screen name="(authenticated)" options={{
        animation: "fade",
        headerShown: false,
        headerTitle: 'Feed',
        headerTitleAlign: 'left',
      }} />
      <Stack.Screen name='(profile)' options={{
        headerRight: () => <Button chromeless circular icon={<X size={20} />} onPress={() => router.back()} />,
        headerShown: true,
        headerTitle: 'Profile',
        presentation: 'modal',
      }} />
      <Stack.Screen name="(public)/login" options={{
        animation: "fade",
        headerShown: false,
      }} />
    </Stack>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TamaguiProvider config={appConfig}>
        <AuthenticationProvider>
          <Screens />
        </AuthenticationProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}