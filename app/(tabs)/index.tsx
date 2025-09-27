import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../src/theme/colors';
import { RecipeCard } from '../../src/components/RecipeCard';

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  likes: number;
  user: {
    username: string;
  };
}

export default function FeedScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.log('Using mock data for demo');
      setRecipes([
        {
          id: 1,
          title: 'Chocolate Chip Cookies',
          description: 'Classic homemade cookies with a perfect chewy texture',
          image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300',
          likes: 45,
          user: { username: 'foodie123' }
        },
        {
          id: 2,
          title: 'Beef Tacos',
          description: 'Authentic Mexican tacos with seasoned ground beef',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
          likes: 78,
          user: { username: 'chef_master' }
        },
        {
          id: 3,
          title: 'Avocado Toast',
          description: 'Healthy breakfast with fresh avocado and herbs',
          image: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=300',
          likes: 32,
          user: { username: 'healthyguru' }
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleLike = async (recipeId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}/like`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        setRecipes(prevRecipes =>
          prevRecipes.map(recipe =>
            recipe.id === recipeId
              ? { ...recipe, likes: data.likes }
              : recipe
          )
        );
      }
    } catch (error) {
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe.id === recipeId
            ? { ...recipe, likes: recipe.likes + 1 }
            : recipe
        )
      );
    }
  };

  const handleRecipePress = (recipe: Recipe) => {
    Alert.alert(recipe.title, `Recipe details would open here for ${recipe.title}`);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes();
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <RecipeCard
      recipe={item}
      onLike={() => handleLike(item.id)}
      onPress={() => handleRecipePress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <View style={styles.headerActions}>
          <Ionicons name="search" size={24} color={Theme.colors.text.primary} />
          <Ionicons name="notifications-outline" size={24} color={Theme.colors.text.primary} />
        </View>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Theme.colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={64} color={Theme.colors.text.light} />
            <Text style={styles.emptyText}>No recipes yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share a recipe!</Text>
          </View>
        }
      />
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
  headerActions: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  list: {
    padding: Theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semiBold,
    color: Theme.colors.text.secondary,
    marginTop: Theme.spacing.md,
  },
  emptySubtext: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text.light,
    marginTop: Theme.spacing.xs,
  },
});
