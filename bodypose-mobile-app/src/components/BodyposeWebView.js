import React, { useContext, useEffect, useRef } from 'react';
import { BackHandler, Linking, Platform, ToastAndroid } from 'react-native';
import { WebView } from 'react-native-webview';
import { BASE_DOMAIN, BASE_URL } from '../constants/url';
import { AuthContext } from '../context';
import { logout } from '../utils/logout';
import LoadingFullscreen from './LoadingFullscreen';

const BodyposeWebView = () => {
  const webview = useRef(null);
  const { logout: appLogout } = useContext(AuthContext);

  const onLogout = () => {
    logout().finally(appLogout);
  };

  const loadingPage = () => {
    return <LoadingFullscreen />;
  };

  const injectedJavascript = `
    (function() {
      function wrap(fn) {
        return function wrapper() {
          var res = fn.apply(this, arguments);
          window.ReactNativeWebView.postMessage('navigation:' + window.location.href);
          return res;
        }
      }
      history.pushState = wrap(history.pushState);
      history.replaceState = wrap(history.replaceState);
      window.onpopstate = function(event) {
        window.ReactNativeWebView.postMessage('navigation:' + window.location.href);
      }
    })();
    true;
  `;

  const onAndroidBackPress = () => {
    // return true: prevent terminating app
    // return false: terminate app
    if (webview.current) {
      if (webview.canGoBack) {
        webview.current.goBack();
        return true;
      } else {
        if (!webview.shouldExit) {
          webview.shouldExit = true;
          ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
          setTimeout(() => {
            webview.shouldExit = false;
          }, 2000); // Two seconds
          return true;
        } else {
          return false;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    }
    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onAndroidBackPress,
        );
      }
    };
  }, []);

  return (
    <WebView
      ref={webview}
      source={{ uri: BASE_URL }}
      sharedCookiesEnabled={true}
      renderLoading={loadingPage}
      startInLoadingState={true}
      onShouldStartLoadWithRequest={navState => {
        const { url } = navState;
        if (url.includes(BASE_DOMAIN)) {
          if (url.includes('/kakaoLink/') || url.includes('/kakaoPhone/')) {
            Linking.openURL(url);
            return false;
          }
          return true;
        } else {
          Linking.openURL(url);
          return false;
        }
      }}
      injectedJavaScript={injectedJavascript}
      onMessage={event => {
        const message = String(event.nativeEvent.data);
        const prefix = 'navigation:';
        if (message.startsWith(prefix)) {
          const url = message.slice(message.indexOf(prefix) + prefix.length);
          if (url.includes(`${BASE_DOMAIN}/logout`)) {
            onLogout();
          } else if (url.endsWith(`${BASE_DOMAIN}/`)) {
            webview.canGoBack = false;
          } else {
            webview.canGoBack = event.nativeEvent.canGoBack;
          }
        }
      }}
    />
  );
};

export default BodyposeWebView;
