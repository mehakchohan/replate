import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../src/theme/colors';

interface LeaderboardUser {
  id: number;
  username: string;
  posts: number;
  totalLikes: number;
}

export default function LeaderboardScreen() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Always sort by totalLikes since we removed sorting options

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/leaderboard');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log('Using mock data for demo');
      setUsers([
        { id: 1, username: 'chef_master', posts: 25, totalLikes: 1250 },
        { id: 2, username: 'foodie123', posts: 12, totalLikes: 890 },
        { id: 3, username: 'healthyguru', posts: 18, totalLikes: 720 },
        { id: 4, username: 'bakerqueen', posts: 15, totalLikes: 650 },
        { id: 5, username: 'spicychef', posts: 8, totalLikes: 420 },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaderboard();
  };

  const sortedUsers = [...users].sort((a, b) => b.totalLikes - a.totalLikes);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Ionicons name="trophy" size={24} color="#FFD700" />;
      case 1:
        return <Ionicons name="medal" size={24} color="#C0C0C0" />;
      case 2:
        return <Ionicons name="medal" size={24} color="#CD7F32" />;
      default:
        return (
          <View style={styles.rankNumber}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
        );
    }
  };


  const renderUser = ({ item, index }: { item: LeaderboardUser; index: number }) => (
    <TouchableOpacity style={styles.userItem}>
      <View style={styles.userRank}>
        {getRankIcon(index)}
      </View>

      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>
          {item.username.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <View style={styles.userStats}>
          <Text style={styles.statText}>{item.posts} posts</Text>
        </View>
      </View>

      <View style={styles.userScore}>
        <Text style={styles.scoreNumber}>
          {item.totalLikes}
        </Text>
        <Text style={styles.scoreLabel}>
          likes
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.titleAccent} />
          <Text style={styles.title}>Leaderboard</Text>
        </View>
        <View style={styles.trophyContainer}>
          <Ionicons name="trophy-outline" size={24} color={Theme.colors.primary} />
        </View>
      </View>


      <FlatList
        data={sortedUsers}
        renderItem={renderUser}
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
            <Ionicons name="trophy-outline" size={64} color={Theme.colors.text.light} />
            <Text style={styles.emptyText}>No rankings yet</Text>
            <Text style={styles.emptySubtext}>Start posting to see the leaderboard!</Text>
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
  trophyContainer: {
    padding: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.secondary,
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
  },
  sortButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.secondary,
    marginHorizontal: Theme.spacing.xs,
  },
  sortButtonActive: {
    backgroundColor: Theme.colors.primary,
  },
  sortText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.colors.text.secondary,
  },
  sortTextActive: {
    color: Theme.colors.text.white,
  },
  list: {
    padding: Theme.spacing.md,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.sm,
  },
  userRank: {
    width: 40,
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  rankNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.semiBold,
    color: Theme.colors.text.primary,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  userAvatarText: {
    color: Theme.colors.text.white,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semiBold,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semiBold,
    color: Theme.colors.text.primary,
    marginBottom: 2,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
  },
  statDivider: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.light,
    marginHorizontal: Theme.spacing.xs,
  },
  userScore: {
    alignItems: 'flex-end',
  },
  scoreNumber: {
    fontSize: Theme.fontSize.lg,
    fontWeight: Theme.fontWeight.bold,
    color: Theme.colors.primary,
  },
  scoreLabel: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.text.secondary,
    textTransform: 'uppercase',
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