import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../src/theme/colors';
import { Button } from '../../src/components/Button';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  followers: number;
  following: number;
  posts: number;
  recipes: Array<{
    id: number;
    title: string;
    image: string;
    likes: number;
  }>;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recipes' | 'liked'>('recipes');

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/1'); // Mock user ID
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log('Using mock data for demo');
      setUser({
        id: 1,
        username: 'foodie123',
        email: 'foodie@example.com',
        followers: 150,
        following: 75,
        posts: 12,
        recipes: [
          {
            id: 1,
            title: 'Chocolate Chip Cookies',
            image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300',
            likes: 45,
          },
          {
            id: 2,
            title: 'Avocado Toast',
            image: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=300',
            likes: 32,
          },
          {
            id: 3,
            title: 'Pasta Carbonara',
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300',
            likes: 67,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature would be implemented here');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings screen would open here');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          Alert.alert('Logged out', 'You have been logged out successfully');
        }},
      ]
    );
  };

  const renderRecipeItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.recipeItem}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeOverlay}>
        <View style={styles.recipeLikes}>
          <Ionicons name="heart" size={16} color={Theme.colors.text.white} />
          <Text style={styles.recipeLikesText}>{item.likes}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color={Theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Edit Profile"
              onPress={handleEditProfile}
              style={styles.editButton}
              variant="outline"
            />
            <Button
              title="Logout"
              onPress={handleLogout}
              style={styles.logoutButton}
              variant="secondary"
            />
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
            onPress={() => setActiveTab('recipes')}
          >
            <Ionicons
              name="grid"
              size={20}
              color={activeTab === 'recipes' ? Theme.colors.primary : Theme.colors.text.secondary}
            />
            <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
              My Recipes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
            onPress={() => setActiveTab('liked')}
          >
            <Ionicons
              name="heart"
              size={20}
              color={activeTab === 'liked' ? Theme.colors.primary : Theme.colors.text.secondary}
            />
            <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTabText]}>
              Liked
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recipesContainer}>
          {activeTab === 'recipes' ? (
            <FlatList
              data={user.recipes}
              renderItem={renderRecipeItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={styles.recipeRow}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="restaurant-outline" size={48} color={Theme.colors.text.light} />
                  <Text style={styles.emptyText}>No recipes yet</Text>
                  <Text style={styles.emptySubtext}>Share your first recipe!</Text>
                </View>
              }
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={48} color={Theme.colors.text.light} />
              <Text style={styles.emptyText}>No liked recipes</Text>
              <Text style={styles.emptySubtext}>Start liking recipes to see them here!</Text>
            </View>
          )}
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
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text.primary,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text.secondary,
  },
  profileHeader: {
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: Theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.md,
  },
  avatarText: {
    color: Theme.colors.text.white,
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
  },
  username: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  email: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text.primary,
  },
  statLabel: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Theme.colors.border,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    width: '100%',
  },
  editButton: {
    flex: 1,
  },
  logoutButton: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background,
    marginTop: Theme.spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    gap: Theme.spacing.xs,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.colors.text.secondary,
  },
  activeTabText: {
    color: Theme.colors.primary,
  },
  recipesContainer: {
    padding: Theme.spacing.md,
  },
  recipeRow: {
    justifyContent: 'space-between',
  },
  recipeItem: {
    width: '32%',
    aspectRatio: 1,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.secondary,
  },
  recipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: Theme.spacing.xs,
  },
  recipeLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeLikesText: {
    color: Theme.colors.text.white,
    fontSize: Theme.fontSize.xs,
    fontWeight: Theme.fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semiBold,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.light,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
  },
});