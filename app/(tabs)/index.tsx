import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RecipeCard } from '../../src/components/RecipeCard';
import { Theme } from '../../src/theme/colors';

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
          image: 'https://unsplash.com/photos/1zjpCGXzlfA/download?force=true&w=300',
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
        },
        {
          id: 9,
          title: 'Spicy Ramen',
          description: 'Rich chicken broth, chili oil, and jammy eggs with spring onions.',
          caption: 'Rainy day comfort 🍜',
          fullRecipe: '1) Simmer stock + miso\n2) Cook noodles 3 min\n3) Top with egg, chili oil, scallions',
          image: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?w=300',
          likes: 121,
          comments: 14,
          triedCount: 52,
          tags: ['spicy', 'quick', 'comfort'],
          user: { username: 'noodle_ninja' },
          isSaved: false,
          isLiked: false,
          isTried: false
        },
        {
          id: 10,
          title: 'Sushi Platter',
          description: 'Assorted nigiri and maki with fresh salmon, tuna, and avocado.',
          caption: 'Roll with it 🍣',
          image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=300',
          likes: 198,
          comments: 27,
          triedCount: 71,
          tags: ['japanese', 'seafood', 'healthy'],
          user: { username: 'umami_club' },
          isSaved: false,
          isLiked: false,
          isTried: false
        },
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
          <Text style={styles.title}>replate</Text>
        </View>
      </View>

      {/* Search Bar */}
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
      // 👇 everything above the list items goes here
      ListHeaderComponent={
        <>
          {/* Search bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <View style={styles.iconBox}>
                <Ionicons name="search" size={20} color={Theme.colors.text.secondary} />
              </View>

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

      {/* Tag Filter */}
      {//(isSearchFocused || searchQuery.length > 0) && (
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
      //)
      }
  </>
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
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAccent: {
    width: 4,
    height: 24,
    backgroundColor: Theme.colors.primaryDark,
    marginRight: Theme.spacing.sm,
    borderRadius: 2,
  },
  title: {
    fontSize: Theme.fontSize.xl,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.primaryDark,
    letterSpacing: 0.2,
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
    paddingVertical: Theme.spacing.md, //16
    paddingHorizontal: Theme.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
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
    marginHorizontal: -16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: Theme.colors.background,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.sm,
    overflow: 'visible',
  },
  iconBox: {
  width: 22,                               // >= icon size
  height: 22,
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: 0,                           // <-- don't let icons get squeezed
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Theme.colors.text.primary,
    fontWeight: Theme.fontWeight.medium,
  },
  tagContainer: {
    backgroundColor: Theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  tagContent: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  tagButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginRight: 6,
  },
  activeTagButton: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
    transform: [{ scale: 1.05 }],
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
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
