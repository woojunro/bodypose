import { Alert } from 'react-native';
import { ERROR_MESSAGE } from '../constants/message';

export const alertError = (message = ERROR_MESSAGE) => {
  Alert.alert('Error', message, [{ text: 'OK' }]);
};
