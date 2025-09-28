import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../src/theme/colors';
import { Button } from '../src/components/Button';

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature would be implemented here');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature would be implemented here');
  };

  const handleBlockedUsers = () => {
    Alert.alert('Blocked Users', 'Blocked users management would be implemented here');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy would be displayed here');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Service', 'Terms of service would be displayed here');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Support feature would be implemented here');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            router.replace('/login');
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted successfully');
            router.replace('/login');
          }
        },
      ]
    );
  };

  const SettingItem = ({
    title,
    subtitle,
    icon,
    onPress,
    showArrow = true,
    rightComponent = null
  }: {
    title: string;
    subtitle?: string;
    icon: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color={Theme.colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <Ionicons name="chevron-forward" size={16} color={Theme.colors.text.light} />
        )}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Account" />
        <View style={styles.section}>
          <SettingItem
            title="Edit Profile"
            subtitle="Update your profile information"
            icon="person-outline"
            onPress={handleEditProfile}
          />
          <SettingItem
            title="Change Password"
            subtitle="Update your account password"
            icon="lock-closed-outline"
            onPress={handleChangePassword}
          />
          <SettingItem
            title="Privacy"
            subtitle="Manage who can see your content"
            icon="eye-outline"
            onPress={() => {}}
            showArrow={false}
            rightComponent={
              <Switch
                value={privateAccount}
                onValueChange={setPrivateAccount}
                trackColor={{ false: Theme.colors.secondary, true: Theme.colors.primary }}
                thumbColor={Theme.colors.text.white}
              />
            }
          />
        </View>

        <SectionHeader title="Notifications" />
        <View style={styles.section}>
          <SettingItem
            title="Push Notifications"
            subtitle="Receive notifications on your device"
            icon="notifications-outline"
            onPress={() => {}}
            showArrow={false}
            rightComponent={
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: Theme.colors.secondary, true: Theme.colors.primary }}
                thumbColor={Theme.colors.text.white}
              />
            }
          />
          <SettingItem
            title="Email Notifications"
            subtitle="Receive notifications via email"
            icon="mail-outline"
            onPress={() => {}}
            showArrow={false}
            rightComponent={
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: Theme.colors.secondary, true: Theme.colors.primary }}
                thumbColor={Theme.colors.text.white}
              />
            }
          />
        </View>

        <SectionHeader title="Preferences" />
        <View style={styles.section}>
          <SettingItem
            title="Dark Mode"
            subtitle="Switch to dark theme"
            icon="moon-outline"
            onPress={() => {}}
            showArrow={false}
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Theme.colors.secondary, true: Theme.colors.primary }}
                thumbColor={Theme.colors.text.white}
              />
            }
          />
          <SettingItem
            title="Blocked Users"
            subtitle="Manage blocked accounts"
            icon="ban-outline"
            onPress={handleBlockedUsers}
          />
        </View>

        <SectionHeader title="Support" />
        <View style={styles.section}>
          <SettingItem
            title="Help & Support"
            subtitle="Get help with using the app"
            icon="help-circle-outline"
            onPress={handleSupport}
          />
          <SettingItem
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            icon="document-text-outline"
            onPress={handlePrivacy}
          />
          <SettingItem
            title="Terms of Service"
            subtitle="Read our terms of service"
            icon="document-outline"
            onPress={handleTerms}
          />
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
          <Button
            title="Delete Account"
            onPress={handleDeleteAccount}
            style={[styles.deleteButton, { backgroundColor: Theme.colors.error }]}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Replate v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
    backgroundColor: Theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
    color: Theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.sm,
  },
  section: {
    backgroundColor: Theme.colors.background,
    marginBottom: Theme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtons: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  logoutButton: {
    borderColor: Theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: Theme.colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
  },
  footerText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.light,
  },
});