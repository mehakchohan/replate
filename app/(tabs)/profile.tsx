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
import { router } from 'expo-router';
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
  savedRecipes: Array<{
    id: number;
    title: string;
    image: string;
    likes: number;
    user: {
      username: string;
    };
  }>;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recipes' | 'saved'>('recipes');

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
        posts: 9,
        recipes: [
          {
            id: 1,
            title: 'Chocolate Chip Cookies',
            image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300',
            likes: 145,
          },
          {
            id: 2,
            title: 'Avocado Toast',
            image: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=300',
            likes: 92,
          },
          {
            id: 3,
            title: 'Pasta Carbonara',
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300',
            likes: 67,
          },
          {
            id: 4,
            title: 'Blueberry Muffins',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
            likes: 84,
          },
          {
            id: 5,
            title: 'Greek Salad',
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
            likes: 53,
          },
          {
            id: 6,
            title: 'Beef Stir Fry',
            image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=300',
            likes: 76,
          },
          {
            id: 7,
            title: 'Lemon Cake',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
            likes: 112,
          },
          {
            id: 8,
            title: 'Fish Tacos',
            image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300',
            likes: 98,
          },
          {
            id: 9,
            title: 'Chicken Curry',
            image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300',
            likes: 87,
          },
        ],
        savedRecipes: [
          {
            id: 101,
            title: 'Avocado Toast',
            image: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=300',
            likes: 92,
            user: { username: 'healthyguru' }
          },
          {
            id: 102,
            title: 'Pizza Margherita',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300',
            likes: 203,
            user: { username: 'pizzamaker' }
          },
          {
            id: 103,
            title: 'Thai Green Curry',
            image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300',
            likes: 67,
            user: { username: 'spicefood_fan' }
          },
          {
            id: 104,
            title: 'Chocolate Lava Cake',
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300',
            likes: 178,
            user: { username: 'dessert_artist' }
          }
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
    router.push('/settings');
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
          <Text style={[styles.recipeLikesText, { marginLeft: 4 }]}>{item.likes}</Text>
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
        <View style={styles.titleContainer}>
          <View style={styles.titleAccent} />
          <Text style={styles.title}>Profile</Text>
        </View>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={Theme.colors.primary} />
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
            <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText, { marginLeft: Theme.spacing.xs }]}>
              My Recipes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Ionicons
              name="bookmark"
              size={20}
              color={activeTab === 'saved' ? Theme.colors.primary : Theme.colors.text.secondary}
            />
            <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText, { marginLeft: Theme.spacing.xs }]}>
              Saved
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recipesContainer}>
          <FlatList
            key={activeTab} // Force re-render when tab changes
            data={activeTab === 'recipes' ? user.recipes : user.savedRecipes}
            renderItem={activeTab === 'recipes' ? renderRecipeItem : ({ item }) => (
              <TouchableOpacity style={styles.savedRecipeItem}>
                <Image source={{ uri: item.image }} style={styles.savedRecipeImage} />
                <View style={styles.savedRecipeInfo}>
                  <Text style={styles.savedRecipeTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.savedRecipeFooter}>
                    <Text style={styles.savedRecipeUser}>by @{item.user.username}</Text>
                    <View style={styles.savedRecipeLikes}>
                      <Ionicons name="heart" size={12} color={Theme.colors.accent} />
                      <Text style={[styles.savedRecipeLikesText, { marginLeft: 2 }]}>{item.likes}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            numColumns={activeTab === 'recipes' ? 3 : 1}
            columnWrapperStyle={activeTab === 'recipes' ? styles.recipeRow : null}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons
                  name={activeTab === 'recipes' ? "restaurant-outline" : "bookmark-outline"}
                  size={48}
                  color={Theme.colors.text.light}
                />
                <Text style={styles.emptyText}>
                  {activeTab === 'recipes' ? 'No recipes yet' : 'No saved recipes'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {activeTab === 'recipes' ? 'Share your first recipe!' : 'Save recipes to see them here!'}
                </Text>
              </View>
            }
          />
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
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.primary,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAccent: {
    width: 4,
    height: 24,
    backgroundColor: Theme.colors.primary,
    marginRight: Theme.spacing.sm,
    borderRadius: 2,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.text.primary,
  },
  settingsButton: {
    padding: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.secondary,
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
    width: '100%',
  },
  editButton: {
    flex: 1,
    marginRight: Theme.spacing.sm,
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
  savedRecipeItem: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  savedRecipeImage: {
    width: 80,
    height: 80,
    backgroundColor: Theme.colors.secondary,
  },
  savedRecipeInfo: {
    flex: 1,
    padding: Theme.spacing.md,
    justifyContent: 'space-between',
  },
  savedRecipeTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semiBold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  savedRecipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedRecipeUser: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
  },
  savedRecipeLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedRecipeLikesText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.text.secondary,
    fontWeight: Theme.fontWeight.medium,
  },
});