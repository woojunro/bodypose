import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import BodyposeWebView from './components/BodyposeWebView';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import NoticeScreen from './screens/NoticeScreen';
import { AuthContext } from './context';
import EmailLoginScreen from './screens/EmailLoginScreen';
import EmailInputScreen from './screens/EmailInputScreen';
import RNBootSplash from 'react-native-bootsplash';
import { refreshAccessToken } from './utils/refreshAccessToken';

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      const isTokenRefreshed = await refreshAccessToken();
      if (isTokenRefreshed) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login: () => setIsLoggedIn(true),
        logout: () => setIsLoggedIn(false),
      }}>
      {isLoggedIn ? (
        <SafeAreaView style={styles.container}>
          <BodyposeWebView />
        </SafeAreaView>
      ) : (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="로그인"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="로그인" component={LoginScreen} />
            <Stack.Screen
              name="공지"
              component={NoticeScreen}
              options={{ headerShown: true, title: 'Loading...' }}
            />
            <Stack.Screen
              name="이메일로 로그인"
              component={EmailLoginScreen}
              options={{ headerShown: true }}
            />
            <Stack.Screen
              name="이메일 입력"
              component={EmailInputScreen}
              options={{ headerShown: true }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
