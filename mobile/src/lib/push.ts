/**
 * Best-effort Expo push-token registration.
 *
 * On Expo Go (SDK 53+) push-notifications support has been removed — registration
 * silently no-ops there. On a real device build (EAS), this returns the ExpoPushToken
 * that can be POSTed to your backend to enable server-side fan-out.
 *
 * In this dev environment there's no server-side push fan-out endpoint, so the token
 * is just persisted in AsyncStorage for the moment; once a `/push-tokens` endpoint
 * is wired on the backend, post the token from here.
 */
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const PUSH_TOKEN_KEY = "credupe.pushToken";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === "web") return null;
  if (!Device.isDevice) return null;

  try {
    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== "granted") {
      const ask = await Notifications.requestPermissionsAsync();
      status = ask.status;
    }
    if (status !== "granted") return null;

    const tokenResp = await Notifications.getExpoPushTokenAsync();
    const token = tokenResp.data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#7C3AED",
      });
    }
    return token;
  } catch {
    return null;
  }
}

export async function getCachedPushToken(): Promise<string | null> {
  return (await AsyncStorage.getItem(PUSH_TOKEN_KEY)) ?? null;
}
