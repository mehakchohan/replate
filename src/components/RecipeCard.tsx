import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    user: { username: string };
    isSaved: boolean;
    isLiked: boolean;
    isTried: boolean;
  };
  onLike: () => void;
  onSave: () => void;
  onTried: () => void;
  onComment: () => void;
  onPress: () => void; // navigate to details / recipe sheet
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

  const hasRecipe = !!recipe.fullRecipe?.trim();

  const handleFullRecipePress = () => {
    if (recipe.fullRecipe) {
      Alert.alert(recipe.title, recipe.fullRecipe, [{ text: 'Close', style: 'cancel' }], {
        cancelable: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{recipe.user.username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.username}>{recipe.user.username}</Text>
        </View>
        <TouchableOpacity onPress={onSave} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons
            name={recipe.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={recipe.isSaved ? Theme.colors.primary : Theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Image + floating pill CTA */}
      <View style={styles.imageWrap}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
        </TouchableOpacity>

        {hasRecipe && (<TouchableOpacity
          style={styles.viewRecipePill}
          onPress={recipe.fullRecipe ? handleFullRecipePress : onPress}
          accessibilityRole="button"
          accessibilityLabel="View recipe"
          activeOpacity={0.85}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="book-outline" size={16} color={Theme.colors.text.white} />
          <Text style={styles.viewRecipePillText}>View recipe</Text>
        </TouchableOpacity>
        )}
      </View>

      {/* Body */}
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        {recipe.caption ? (
          // keep caption clean (no underline, no extra link)
          <Text style={styles.caption}>{recipe.caption}</Text>
        ) : null}

        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        {/* Neutral tags */}
        {recipe.tags?.length ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsContainer}
            contentContainerStyle={styles.tagsContent}
          >
            {recipe.tags.map((tag, i) => (
              <View key={`${tag}-${i}`} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </ScrollView>
        ) : null}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onLike} hitSlop={8 as any}>
            <Ionicons
              name={recipe.isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={recipe.isLiked ? Theme.colors.accent : Theme.colors.text.secondary}
            />
            <Text
              style={[
                styles.actionText,
                recipe.isLiked && styles.likedText,
                { marginLeft: Theme.spacing.xs },
              ]}
            >
              {recipe.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onComment} hitSlop={8 as any}>
            <Ionicons name="chatbubble-outline" size={18} color={Theme.colors.text.secondary} />
            <Text style={[styles.actionText, { marginLeft: Theme.spacing.xs }]}>
              {recipe.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onTried} hitSlop={8 as any}>
            <Ionicons
              name={recipe.isTried ? 'restaurant' : 'restaurant-outline'}
              size={18}
              color={recipe.isTried ? Theme.colors.primary : Theme.colors.text.secondary}
            />
            <Text
              style={[
                styles.actionText,
                recipe.isTried && styles.triedText,
                { marginLeft: Theme.spacing.xs },
              ]}
            >
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
  userInfo: { flexDirection: 'row', alignItems: 'center' },
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

  /* === image + pill === */
  imageWrap: { position: 'relative' },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Theme.colors.secondary,
  },
  viewRecipePill: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    backgroundColor: Theme.colors.primary, // maroon
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewRecipePillText: {
    color: Theme.colors.text.white,
    fontWeight: Theme.fontWeight.semiBold,
    fontSize: 13,
  },

  /* === body === */
  content: { padding: Theme.spacing.md },
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
    fontStyle: 'italic', // no underline
  },
  description: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: Theme.spacing.sm,
  },

  /* === NEUTRAL TAGS === */
  tagsContainer: { marginBottom: Theme.spacing.sm },
  tagsContent: { paddingRight: Theme.spacing.xs },
  tag: {
    backgroundColor: Theme.colors.background,     // neutral bg
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.colors.border,             // neutral border
    marginRight: Theme.spacing.xs,
  },
  tagText: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.text.secondary,           // neutral text (not maroon)
    fontWeight: Theme.fontWeight.semiBold,
  },

  /* === actions === */
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
  likedText: { color: Theme.colors.accent },
  triedText: { color: Theme.colors.primary },
});
