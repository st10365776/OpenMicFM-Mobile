
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/bottom-nav';
import { useAppContext } from '../context/app-context';

/* =========================================================
   API
========================================================= */

const API_URL =
  'https://openmic-fddchhhhajbtfmbv.southafricanorth-01.azurewebsites.net';

export default function ContactScreen() {
  const router = useRouter();
  const { colors, user } = useAppContext();

  const [name, setName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // SEND THE MESSAGE TO OUR API
  const sendMessage = async () => {
    if (sending) return;

    setError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    // Check user inputs
    if (cleanName.length < 2 || cleanName.length > 120) {
      setError('Please enter your full name.');
      return;
    }

    if (
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      setError('Please enter a valid email address.');
      return;
    }

    if (cleanSubject.length < 3 || cleanSubject.length > 150) {
      setError('Please enter a subject.');
      return;
    }

    if (cleanMessage.length < 10 || cleanMessage.length > 3000) {
      setError('Please enter a message of at least 10 characters.');
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          source: 'mobile',
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.error || 'Unable to send your message.'
        );
      }

      setSubject('');
      setMessage('');

      Alert.alert(
        'Message Sent',
        'Thank you for contacting OpenMic FM!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the server.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* BACK BUTTON */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={{ color: colors.muted }}>
              ← BACK
            </Text>
          </TouchableOpacity>

          {/* HEADING */}
          <Text
            style={[
              styles.smallTitle,
              { color: colors.red },
            ]}
          >
            OPENMIC FM COMMUNITY
          </Text>

          <Text
            style={[
              styles.heading,
              { color: colors.text },
            ]}
          >
            CONTACT US.
          </Text>

          <Text
            style={[
              styles.description,
              { color: colors.muted },
            ]}
          >
            Have a question, suggestion or advertising
            enquiry? Send us a message.
          </Text>

          {/* CONTACT FORM */}
          <View
            style={[
              styles.form,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.label, { color: colors.text }]}>
              FULL NAME
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.subtle}
              value={name}
              onChangeText={setName}
              maxLength={120}
            />

            <Text style={[styles.label, { color: colors.text }]}>
              EMAIL ADDRESS
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Enter your email address"
              placeholderTextColor={colors.subtle}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              maxLength={254}
            />

            <Text style={[styles.label, { color: colors.text }]}>
              SUBJECT
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Enter subject"
              placeholderTextColor={colors.subtle}
              value={subject}
              onChangeText={setSubject}
              maxLength={150}
            />

            <Text style={[styles.label, { color: colors.text }]}>
              MESSAGE
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.messageInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Write your message here..."
              placeholderTextColor={colors.subtle}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
              maxLength={3000}
            />

            {/* VALIDATION ERRORS */}
            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            {/* SEND BUTTON */}
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: colors.red },
              ]}
              onPress={sendMessage}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.sendText}>
                  SEND MESSAGE →
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 110,
  },
  backButton: {
    marginBottom: 25,
    paddingVertical: 10,
  },
  smallTitle: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  heading: {
    fontSize: 34,
    fontWeight: '900',
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 25,
  },
  form: {
    padding: 18,
    borderWidth: 1,
    borderRadius: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 9,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  messageInput: {
    minHeight: 150,
  },
  error: {
    color: '#FF5555',
    fontSize: 12,
    marginTop: 15,
  },
  sendButton: {
    height: 55,
    borderRadius: 10,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
});
