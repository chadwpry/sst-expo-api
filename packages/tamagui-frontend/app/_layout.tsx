import { useEffect } from 'react';
import { createTamagui, TamaguiProvider, View } from 'tamagui';
import { config } from '@tamagui/config/v2';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { AuthenticationProvider, useAuthentication } from '@/services/Authentication';

const tamaguiConfig = createTamagui(config)

// this makes typescript properly type everything based on the config
type Conf = typeof tamaguiConfig
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

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
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
    ...FontAwesome.font,
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
    <Stack initialRouteName='(authenticated)'>
      <Stack.Screen name="(authenticated)" options={{
        animation: "fade",
        headerShown: false,
      }} />
      <Stack.Screen name='(profile)' options={{
        headerShown: false,
        title: undefined,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerShadowVisible: false,
        presentation: 'fullScreenModal',
      }} />
      <Stack.Screen name="(public)/login" options={{ headerShown: false, animation: "fade" }} />
    </Stack>
  );
}

function RootLayoutNav() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <AuthenticationProvider>
        <Screens />
      </AuthenticationProvider>
    </TamaguiProvider>
  );
}
