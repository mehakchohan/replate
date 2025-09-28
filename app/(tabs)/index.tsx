import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../src/theme/colors';
import { RecipeCard } from '../../src/components/RecipeCard';

interface Recipe {
  id: number;
  title: string;
  description: string;
  caption?: string;
  fullRecipe?: string;
  image: string;
  likes: number;
  comments: number;
  triedCount: number;
  tags: string[];
  user: {
    username: string;
  };
  isSaved: boolean;
  isLiked: boolean;
  isTried: boolean;
}

export default function FeedScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'friends' | 'community'>('friends');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const popularTags = ['italian', 'coffee', 'quick', 'healthy', 'dessert', 'spicy', 'vegetarian', 'comfort'];

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.log('Using mock data for demo');
      const mockRecipes = [
        {
          id: 1,
          title: 'Chocolate Chip Cookies',
          description: 'Classic homemade cookies with a perfect chewy texture. Made with brown butter for extra flavor!',
          caption: 'These cookies are amazing! Perfect for any occasion 🍪',
          fullRecipe: '1. Cream butter and sugars\n2. Add eggs and vanilla\n3. Mix in flour, baking soda, salt\n4. Fold in chocolate chips\n5. Bake at 375°F for 9-11 minutes',
          image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300',
          likes: 145,
          comments: 23,
          triedCount: 67,
          tags: ['dessert', 'quick', 'comfort'],
          user: { username: 'cookiemaster' },
          isSaved: false,
          isLiked: false,
          isTried: false
        },
        {
          id: 2,
          title: 'Beef Tacos',
          description: 'Authentic Mexican tacos with seasoned ground beef, fresh cilantro, and lime',
          caption: 'Taco Tuesday done right! 🌮',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
          likes: 78,
          comments: 12,
          triedCount: 34,
          tags: ['spicy', 'quick'],
          user: { username: 'chef_master' },
          isSaved: false,
          isLiked: true,
          isTried: false
        },
        {
          id: 3,
          title: 'Avocado Toast',
          description: 'Healthy breakfast with fresh avocado, cherry tomatoes, and everything bagel seasoning',
          caption: 'Simple, healthy, and delicious! Perfect morning fuel ✨',
          fullRecipe: '1. Toast bread until golden\n2. Mash avocado with lime and salt\n3. Spread on toast\n4. Top with tomatoes and seasoning',
          image: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=300',
          likes: 92,
          comments: 8,
          triedCount: 45,
          tags: ['healthy', 'quick', 'vegetarian'],
          user: { username: 'healthyguru' },
          isSaved: true,
          isLiked: false,
          isTried: true
        },
        {
          id: 4,
          title: 'Creamy Mushroom Risotto',
          description: 'Rich and creamy risotto with wild mushrooms and parmesan cheese',
          caption: 'Comfort food at its finest! 🍄',
          image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=300',
          likes: 156,
          comments: 19,
          triedCount: 28,
          tags: ['italian', 'comfort', 'vegetarian'],
          user: { username: 'italianfood_lover' },
          isSaved: false,
          isLiked: false,
          isTried: false
        },
        {
          id: 5,
          title: 'Homemade Pizza Margherita',
          description: 'Classic pizza with fresh basil, mozzarella, and San Marzano tomatoes',
          caption: 'Nothing beats homemade pizza! 🍕',
          fullRecipe: '1. Make pizza dough\n2. Roll out thin\n3. Add tomato sauce\n4. Top with mozzarella and basil\n5. Bake at 500°F for 10-12 minutes',
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300',
          likes: 203,
          comments: 31,
          triedCount: 89,
          tags: ['italian', 'comfort'],
          user: { username: 'pizzamaker' },
          isSaved: true,
          isLiked: true,
          isTried: false
        },
        {
          id: 6,
          title: 'Thai Green Curry',
          description: 'Spicy and aromatic green curry with coconut milk and fresh vegetables',
          caption: 'Spice level: 🌶️🌶️🌶️',
          image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300',
          likes: 67,
          comments: 15,
          triedCount: 22,
          tags: ['spicy', 'healthy'],
          user: { username: 'spicefood_fan' },
          isSaved: false,
          isLiked: false,
          isTried: false
        },
        {
          id: 7,
          title: 'Iced Coffee',
          description: 'Perfect cold brew coffee for hot summer days',
          caption: 'My daily fuel ☕',
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300',
          likes: 89,
          comments: 6,
          triedCount: 156,
          tags: ['coffee', 'quick'],
          user: { username: 'coffee_lover' },
          isSaved: false,
          isLiked: true,
          isTried: true
        },
        {
          id: 8,
          title: 'Grilled Salmon',
          description: 'Perfectly grilled salmon with lemon herb butter and asparagus',
          caption: 'Healthy dinner ready in 20 minutes! 🐟',
          image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300',
          likes: 134,
          comments: 11,
          triedCount: 43,
          tags: ['healthy', 'quick'],
          user: { username: 'seafood_chef' },
          isSaved: false,
          isLiked: false,
          isTried: false
        }
      ];

      setRecipes(feedType === 'friends' ? mockRecipes.slice(0, 5) : mockRecipes);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [feedType]);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchQuery, selectedTag]);

  const filterRecipes = () => {
    let filtered = [...recipes];

    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(recipe =>
        recipe.tags && recipe.tags.includes(selectedTag)
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleLike = (recipeId: number) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? {
              ...recipe,
              likes: recipe.isLiked ? recipe.likes - 1 : recipe.likes + 1,
              isLiked: !recipe.isLiked
            }
          : recipe
      )
    );
  };

  const handleSave = (recipeId: number) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? { ...recipe, isSaved: !recipe.isSaved }
          : recipe
      )
    );
  };

  const handleTried = (recipeId: number) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? {
              ...recipe,
              triedCount: recipe.isTried ? recipe.triedCount - 1 : recipe.triedCount + 1,
              isTried: !recipe.isTried
            }
          : recipe
      )
    );
  };

  const handleComment = (recipeId: number) => {
    Alert.alert('Comments', 'Comments feature would open here');
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
      onSave={() => handleSave(item.id)}
      onTried={() => handleTried(item.id)}
      onComment={() => handleComment(item.id)}
      onPress={() => handleRecipePress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleAccent} />
          <Text style={styles.title}>Feed</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications-outline" size={24} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Feed Type Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, feedType === 'friends' && styles.activeTab]}
          onPress={() => setFeedType('friends')}
        >
          <Ionicons
            name="people"
            size={20}
            color={feedType === 'friends' ? Theme.colors.primary : Theme.colors.text.secondary}
          />
          <Text style={[styles.tabText, feedType === 'friends' && styles.activeTabText, { marginLeft: Theme.spacing.xs }]}>
            Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, feedType === 'community' && styles.activeTab]}
          onPress={() => setFeedType('community')}
        >
          <Ionicons
            name="globe"
            size={20}
            color={feedType === 'community' ? Theme.colors.primary : Theme.colors.text.secondary}
          />
          <Text style={[styles.tabText, feedType === 'community' && styles.activeTabText, { marginLeft: Theme.spacing.xs }]}>
            Community
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Theme.colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, { marginLeft: Theme.spacing.sm }]}
            placeholder="Search recipes, tags..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholderTextColor={Theme.colors.text.light}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={20} color={Theme.colors.text.secondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Tag Filter - Only show when search is focused or has content */}
      {(isSearchFocused || searchQuery.length > 0) && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagContainer}
          contentContainerStyle={styles.tagContent}
        >
          <TouchableOpacity
            style={[styles.tagButton, !selectedTag && styles.activeTagButton]}
            onPress={() => setSelectedTag(null)}
          >
            <Text style={[styles.tagText, !selectedTag && styles.activeTagText]}>All</Text>
          </TouchableOpacity>
          {popularTags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[styles.tagButton, selectedTag === tag && styles.activeTagButton]}
              onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              <Text style={[styles.tagText, selectedTag === tag && styles.activeTagText]}>
                #{tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <FlatList
        data={filteredRecipes}
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
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery || selectedTag
                ? 'Try adjusting your search or filters'
                : 'Be the first to share a recipe!'}
            </Text>
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
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.secondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
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
  searchContainer: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.xl,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text.primary,
    fontWeight: Theme.fontWeight.medium,
  },
  tagContainer: {
    backgroundColor: Theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  tagContent: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  tagButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: Theme.colors.background,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    marginRight: Theme.spacing.sm,
    ...Theme.shadows.sm,
  },
  activeTagButton: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
    transform: [{ scale: 1.05 }],
  },
  tagText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
    color: Theme.colors.text.primary,
  },
  activeTagText: {
    color: Theme.colors.text.white,
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
