import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Text, TouchableOpacity } from 'react-native';
import { googleSignInStyles as styles } from './google-sign-in-button.styles';
import type { GoogleSignInButtonProps } from './google-sign-in-button.types';

const GOOGLE_CLIENT_IDS = {
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton({
  disabled,
  onGoogleIdToken,
  onError,
}: GoogleSignInButtonProps) {
  const [request, , promptAsync] = Google.useIdTokenAuthRequest(GOOGLE_CLIENT_IDS);
  const isConfigured = Boolean(GOOGLE_CLIENT_IDS.iosClientId || GOOGLE_CLIENT_IDS.webClientId);

  const handlePress = async () => {
    if (!isConfigured) {
      onError('Google sign-in is not configured for this platform.');
      return;
    }

    if (!request) {
      onError('Google sign-in is still loading. Please try again.');
      return;
    }

    try {
      const result = await promptAsync();
      if (result.type === 'cancel' || result.type === 'dismiss') return;
      if (result.type === 'error') {
        onError(result.error?.message || 'Google sign-in could not be completed.');
        return;
      }
      if (result.type !== 'success') return;

      const idToken = result.params.id_token;
      if (!idToken) {
        onError('Google did not return an ID token. Please try again.');
        return;
      }

      await onGoogleIdToken(idToken);
    } catch (requestError) {
      console.error('Google OAuth failed:', requestError);
      onError('Google sign-in could not be completed. Please try again.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      disabled={disabled || (isConfigured && !request)}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>G</Text>
      <Text style={styles.text}>CONTINUE WITH GOOGLE</Text>
    </TouchableOpacity>
  );
}
