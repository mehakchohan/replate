import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../theme/colors';

interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    description: string;
    image: string;
    likes: number;
    user: {
      username: string;
    };
  };
  onLike: () => void;
  onPress: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onLike,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {recipe.user.username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.username}>{recipe.user.username}</Text>
        </View>
      </View>

      <Image source={{ uri: recipe.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.likeButton} onPress={onLike}>
            <Ionicons name="heart" size={20} color={Theme.colors.accent} />
            <Text style={styles.likeCount}>{recipe.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={18} color={Theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={18} color={Theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
  description: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: Theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.lg,
  },
  likeCount: {
    marginLeft: Theme.spacing.xs,
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
    fontWeight: Theme.fontWeight.medium,
  },
  actionButton: {
    marginRight: Theme.spacing.md,
  },
});