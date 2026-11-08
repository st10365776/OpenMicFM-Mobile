import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { Text, TouchableOpacity } from 'react-native';
import { googleSignInStyles as styles } from './google-sign-in-button.styles';
import type { GoogleSignInButtonProps } from './google-sign-in-button.types';

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

if (webClientId) {
  GoogleSignin.configure({ webClientId });
}

export default function GoogleSignInButton({
  disabled,
  onGoogleIdToken,
  onError,
}: GoogleSignInButtonProps) {
  const handlePress = async () => {
    if (!webClientId) {
      onError('Google sign-in is not configured for Android.');
      return;
    }

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) return;

      const idToken = response.data.idToken;
      if (!idToken) {
        onError('Google did not return an ID token. Please try again.');
        return;
      }

      await onGoogleIdToken(idToken);
    } catch (signInError) {
      console.error('Native Google sign-in failed:', signInError);
      if (
        typeof signInError === 'object' &&
        signInError !== null &&
        'code' in signInError &&
        signInError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        onError('Google Play Services is unavailable or needs updating.');
        return;
      }

      onError(
        signInError instanceof Error && signInError.message
          ? signInError.message
          : 'Google sign-in could not be completed. Please try again.'
      );
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>G</Text>
      <Text style={styles.text}>CONTINUE WITH GOOGLE</Text>
    </TouchableOpacity>
  );
}
