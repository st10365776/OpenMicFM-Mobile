
import { useState } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';
import {
  useAppContext,
  useThemedStyles,
  type ListenerProfile,
} from '../context/app-context';

const API_URL =
  'https://openmic-fddchhhhajbtfmbv.southafricanorth-01.azurewebsites.net';

const RED = '#D71920';
const WHITE = '#FFFFFF';
const BLACK = '#000000';
const GREY = '#929292';
const SURFACE = '#151515';
const BORDER = '#292929';

type AuthProps = {
  mode: 'login' | 'register';
};

export default function AuthForm({ mode }: AuthProps) {
  const router = useRouter();
  const { signIn } = useAppContext();
  const styles = useThemedStyles(baseStyles);

  const isRegister = mode === 'register';

  /* =======================================================
     INPUT STATES
  ======================================================= */

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* =======================================================
     LOGIN AND REGISTRATION VALIDATION
  ======================================================= */

  const handleSubmit = async () => {
    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (isRegister && name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (isRegister) {
      const strongPassword =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);

      if (!strongPassword) {
        setError(
          'Password must have 8 characters, uppercase, lowercase, a number and a symbol.'
        );
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${API_URL}/api/listeners/${isRegister ? 'register' : 'login'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            isRegister
              ? { fullName: name.trim(), email: cleanEmail, password }
              : { email: cleanEmail, password }
          ),
        }
      );

      let data: {
        token?: unknown;
        user?: ListenerProfile;
        error?: unknown;
        message?: unknown;
      };
      try {
        data = await response.json();
      } catch {
        setError('The server returned an invalid response. Please try again.');
        return;
      }

      if (!response.ok) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : typeof data.message === 'string'
              ? data.message
              : `Request failed (${response.status}).`
        );
        return;
      }

      if (isRegister) {
        Alert.alert(
          'Registration successful',
          'Your account has been created. You can now log in.',
          [{ text: 'Go to Login', onPress: () => router.replace('/' as never) }]
        );
        return;
      }

      if (typeof data.token !== 'string' || !data.token) {
        setError('The login response did not include an authentication token.');
        return;
      }

      const profile = data.user || {};
      signIn(data.token, {
        ...profile,
        fullName:
          typeof profile.fullName === 'string'
            ? profile.fullName
            : typeof profile.name === 'string'
              ? profile.name
              : cleanEmail,
        email:
          typeof profile.email === 'string' ? profile.email : cleanEmail,
      });
      router.replace('/profile' as never);
    } catch (requestError) {
      console.error('Azure listener authentication failed:', requestError);
      setError(
        'Cannot connect to the OpenMicFM account service. Check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
    Alert.alert(
      isRegister ? 'Registration ready' : 'Login ready',
      isRegister
        ? 'Your account details look good. Connect the backend later to complete signup.'
        : 'Your credentials look good. Connect the backend later to complete login.',
      [
        {
          text: 'Continue',
          onPress: () => router.replace(isRegister ? '/login' : '/'),
        },
      ]
    );
  };

  /* =======================================================
     SCREEN DESIGN
  ======================================================= */

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        {/* OPENMIC FM LOGO */}

        <View style={styles.logo}>
          <Text style={styles.logoText}>OM</Text>
        </View>

        <Text style={styles.brand}>OPENMIC FM</Text>

        <Text style={styles.tagline}>
          YOUR VOICE. YOUR STATION.
        </Text>

        {/* PAGE HEADING */}

        <Text style={styles.heading}>
          {isRegister ? 'CREATE ACCOUNT.' : 'WELCOME BACK.'}
        </Text>

        <Text style={styles.description}>
          {isRegister
            ? 'Join OpenMic FM and stay connected to your favourite station.'
            : 'Sign in to your account and enjoy OpenMic FM.'}
        </Text>

        {/* FULL NAME - REGISTRATION ONLY */}

        {isRegister && (
          <>
            <Text style={styles.label}>FULL NAME</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={GREY}
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
            />
          </>
        )}

        {/* EMAIL ADDRESS */}

        <Text style={styles.label}>EMAIL ADDRESS</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor={GREY}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />

        {/* PASSWORD */}

        <Text style={styles.label}>PASSWORD</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            placeholderTextColor={GREY}
            secureTextEntry={!showPassword}
            autoComplete={
              isRegister ? 'new-password' : 'current-password'
            }
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.showText}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONFIRM PASSWORD - REGISTRATION ONLY */}

        {isRegister && (
          <>
            <Text style={styles.label}>
              CONFIRM PASSWORD
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor={GREY}
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </>
        )}

        {/* VALIDATION ERROR */}

        {error ? (
          <Text style={styles.errorText}>
            {error}
          </Text>
        ) : null}

        {/* LOGIN OR REGISTER BUTTON */}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting
              ? 'PLEASE WAIT…'
              : isRegister
                ? 'CREATE ACCOUNT →'
                : 'LOG IN →'}
          </Text>
        </TouchableOpacity>

        {/* SWITCH BETWEEN LOGIN AND REGISTER */}

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {isRegister
              ? 'Already have an account? '
              : "Don't have an account? "}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (isRegister) {
                router.push('/login' as never);
              } else {
                router.push('/register' as never);
              }
            }}
          >
            <Text style={styles.switchLink}>
              {isRegister ? 'Log In' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTINUE WITHOUT AN ACCOUNT */}

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.guestText}>
            CONTINUE AS GUEST →
          </Text>
        </TouchableOpacity>

        {/* FOOTER */}

        <Text style={styles.footer}>
          OPENMIC FM • GQEBERHA, SOUTH AFRICA
        </Text>

      </ScrollView>
    </View>
  );
}

/* =========================================================
   STYLING - LOGIN AND REGISTRATION PAGES
========================================================= */

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 70,
    paddingBottom: 45,
  },

  logo: {
    width: 75,
    height: 75,
    backgroundColor: RED,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  logoText: {
    color: WHITE,
    fontSize: 27,
    fontWeight: '900',
  },

  brand: {
    color: WHITE,
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 18,
    letterSpacing: 2,
  },

  tagline: {
    color: RED,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 2,
  },

  heading: {
    color: WHITE,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 48,
  },

  description: {
    color: GREY,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 22,
  },

  label: {
    color: WHITE,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 10,
    letterSpacing: 1,
  },

  input: {
    backgroundColor: SURFACE,
    color: WHITE,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SURFACE,
    height: 55,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 16,
  },

  passwordInput: {
    flex: 1,
    color: WHITE,
    fontSize: 15,
  },

  showText: {
    color: RED,
    fontWeight: '900',
    fontSize: 11,
  },

  errorText: {
    color: '#D71920',
    fontSize: 12,
    marginTop: 15,
    lineHeight: 19,
  },

  submitButton: {
    backgroundColor: RED,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },

  submitText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 27,
  },

  switchText: {
    color: GREY,
    fontSize: 13,
  },

  switchLink: {
    color: RED,
    fontSize: 13,
    fontWeight: '800',
  },

  guestButton: {
    alignItems: 'center',
    marginTop: 35,
  },

  guestText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },

  footer: {
    color: '#666666',
    textAlign: 'center',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 65,
  },
});
