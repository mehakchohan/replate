import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme/colors';

interface RecipeCardProps {
  recipe: {
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
  };
  onLike: () => void;
  onSave: () => void;
  onTried: () => void;
  onComment: () => void;
  onPress: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onLike,
  onSave,
  onTried,
  onComment,
  onPress,
}) => {
  const [showFullRecipe, setShowFullRecipe] = useState(false);

  const handleFullRecipePress = () => {
    if (recipe.fullRecipe) {
      Alert.alert(
        recipe.title,
        recipe.fullRecipe,
        [{ text: 'Close', style: 'cancel' }],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {recipe.user.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.username}>{recipe.user.username}</Text>
        </View>
        <TouchableOpacity onPress={onSave}>
          <Ionicons
            name={recipe.isSaved ? "bookmark" : "bookmark-outline"}
            size={20}
            color={recipe.isSaved ? Theme.colors.primary : Theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        {recipe.caption && (
          <TouchableOpacity onPress={recipe.fullRecipe ? handleFullRecipePress : undefined}>
            <Text style={[styles.caption, recipe.fullRecipe && styles.clickableCaption]}>
              {recipe.caption}
              {recipe.fullRecipe && (
                <Text style={styles.readMoreText}> tap to see recipe</Text>
              )}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsContainer}
            contentContainerStyle={styles.tagsContent}
          >
            {recipe.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onLike}>
            <Ionicons
              name={recipe.isLiked ? "heart" : "heart-outline"}
              size={20}
              color={recipe.isLiked ? Theme.colors.accent : Theme.colors.text.secondary}
            />
            <Text style={[styles.actionText, recipe.isLiked && styles.likedText, { marginLeft: Theme.spacing.xs }]}>
              {recipe.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onComment}>
            <Ionicons name="chatbubble-outline" size={18} color={Theme.colors.text.secondary} />
            <Text style={[styles.actionText, { marginLeft: Theme.spacing.xs }]}>{recipe.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onTried}>
            <Ionicons
              name={recipe.isTried ? "restaurant" : "restaurant-outline"}
              size={18}
              color={recipe.isTried ? Theme.colors.primary : Theme.colors.text.secondary}
            />
            <Text style={[styles.actionText, recipe.isTried && styles.triedText, { marginLeft: Theme.spacing.xs }]}>
              {recipe.triedCount}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background,
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    ...Theme.shadows.sm,
    overflow: 'hidden',
  },
  header: {
    padding: Theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  avatarText: {
    color: Theme.colors.text.white,
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
  },
  username: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.colors.text.primary,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Theme.colors.secondary,
  },
  content: {
    padding: Theme.spacing.md,
  },
  title: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.semiBold,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  caption: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text.primary,
    fontWeight: Theme.fontWeight.medium,
    marginBottom: Theme.spacing.xs,
    fontStyle: 'italic',
  },
  clickableCaption: {
    color: Theme.colors.primary,
    textDecorationLine: 'underline',
  },
  readMoreText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
    fontStyle: 'normal',
    fontWeight: Theme.fontWeight.regular,
  },
  description: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: Theme.spacing.sm,
  },
  fullRecipeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.sm,
  },
  fullRecipeText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.primary,
    fontWeight: Theme.fontWeight.medium,
  },
  tagsContainer: {
    marginBottom: Theme.spacing.sm,
  },
  tagsContent: {
    paddingRight: Theme.spacing.xs,
  },
  tag: {
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginRight: Theme.spacing.xs,
  },
  tagText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.primary,
    fontWeight: Theme.fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
  },
  actionText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
    fontWeight: Theme.fontWeight.medium,
  },
  likedText: {
    color: Theme.colors.accent,
  },
  triedText: {
    color: Theme.colors.primary,
  },
});