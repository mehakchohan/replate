import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../src/theme/colors';
import { Button } from '../src/components/Button';

export default function AuthScreen() {
  const goToLogin = () => {
    router.push('/login');
  };

  const goToSignup = () => {
    router.push('/signup');
  };

  const skipAuth = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="restaurant" size={60} color={Theme.colors.text.white} />
            </View>
            <Text style={styles.title}>Welcome to Replate</Text>
            <Text style={styles.subtitle}>
              Discover amazing recipes and share your culinary adventures with food lovers around the world
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Sign In"
            onPress={goToLogin}
            style={styles.primaryButton}
          />

          <Button
            title="Create Account"
            onPress={goToSignup}
            variant="outline"
            style={styles.secondaryButton}
          />

          <TouchableOpacity onPress={skipAuth} style={styles.skipButton}>
            <Text style={styles.skipText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.lg,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Theme.spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.xl,
    ...Theme.shadows.lg,
  },
  title: {
    fontSize: Theme.fontSize.xxl + 4,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Theme.spacing.md,
  },
  buttonContainer: {
    paddingBottom: Theme.spacing.xxl,
    gap: Theme.spacing.md,
  },
  primaryButton: {
    marginBottom: Theme.spacing.sm,
  },
  secondaryButton: {
    marginBottom: Theme.spacing.lg,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
  },
  skipText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text.secondary,
    fontWeight: Theme.fontWeight.medium,
  },
});