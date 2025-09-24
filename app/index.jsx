import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, InteractionManager } from "react-native";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("userToken");

      // 👇 wait until navigation system is ready
      InteractionManager.runAfterInteractions(() => {
        if (token) {
          router.replace("/home");    // must match app/home.jsx
        } else {
          router.replace("/landing"); // must match app/landing.jsx
        }
        setLoading(false);
      });
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
}
