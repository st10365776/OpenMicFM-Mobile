export type GoogleSignInButtonProps = {
  disabled: boolean;
  onGoogleIdToken: (idToken: string) => Promise<void>;
  onError: (message: string) => void;
};
