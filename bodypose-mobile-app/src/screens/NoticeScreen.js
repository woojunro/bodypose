import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { getNotice } from '../utils/getNotice';

const { width } = Dimensions.get('window');

const NoticeScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');

  useEffect(() => {
    let isComponentMounted = true;
    if (!route.params?.id) {
      navigation.goBack();
    }
    getNotice(route.params.id)
      .then(notice => {
        if (isComponentMounted) {
          navigation.setOptions({ title: notice.title });
          setContent(notice.content);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isComponentMounted) {
          navigation.goBack();
        }
      });
    return () => {
      isComponentMounted = false;
    };
  }, []);

  return loading ? (
    <SafeAreaView style={styles.Container}>
      <View style={styles.LoadingView}>
        <ActivityIndicator />
      </View>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.ContentView}>
      <ScrollView>
        <Text>{content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  LoadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ContentView: {
    marginVertical: 10,
    marginHorizontal: width * 0.05,
  },
});

export default NoticeScreen;
