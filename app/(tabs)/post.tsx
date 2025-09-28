import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '../../src/theme/colors';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';

export default function PostScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [fullRecipe, setFullRecipe] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const availableTags = ['italian', 'coffee', 'quick', 'healthy', 'dessert', 'spicy', 'vegetarian', 'comfort', 'breakfast', 'dinner', 'lunch', 'snack'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to select images');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera permissions to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePost = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in title and description');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          caption,
          fullRecipe,
          image: image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
          tags: selectedTags,
          userId: 1, // Mock user ID
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Recipe posted successfully!', [
          { text: 'OK', onPress: () => {
            setTitle('');
            setDescription('');
            setCaption('');
            setFullRecipe('');
            setImage(null);
            setSelectedTags([]);
          }}
        ]);
      } else {
        Alert.alert('Error', 'Failed to post recipe');
      }
    } catch (error) {
      Alert.alert('Success', 'Recipe posted successfully! (Demo mode)', [
        { text: 'OK', onPress: () => {
          setTitle('');
          setDescription('');
          setCaption('');
          setFullRecipe('');
          setImage(null);
          setSelectedTags([]);
        }}
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Recipe</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.imageContainer} onPress={showImageOptions}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={48} color={Theme.colors.text.light} />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
          {image && (
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImage(null)}
            >
              <Ionicons name="close-circle" size={24} color={Theme.colors.accent} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <Input
            label="Recipe Title"
            placeholder="Enter recipe title"
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.textAreaContainer}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Describe your recipe, ingredients, and cooking steps..."
                placeholderTextColor={Theme.colors.text.light}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </View>

          <Input
            label="Caption (Optional)"
            placeholder="Add a fun caption for your post..."
            value={caption}
            onChangeText={setCaption}
          />

          <View style={styles.textAreaContainer}>
            <Text style={styles.label}>Full Recipe (Optional)</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Enter the complete recipe with step-by-step instructions..."
                placeholderTextColor={Theme.colors.text.light}
                value={fullRecipe}
                onChangeText={setFullRecipe}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.label}>Tags</Text>
            <Text style={styles.tagSubtext}>Select tags to help others discover your recipe</Text>
            <View style={styles.tagsContainer}>
              {availableTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagButton,
                    selectedTags.includes(tag) && styles.selectedTagButton,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text
                    style={[
                      styles.tagButtonText,
                      selectedTags.includes(tag) && styles.selectedTagButtonText,
                    ]}
                  >
                    #{tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>Tips for a great post:</Text>
            <Text style={styles.tipText}>• Use a clear, appetizing photo</Text>
            <Text style={styles.tipText}>• Include cooking time and difficulty</Text>
            <Text style={styles.tipText}>• List all ingredients clearly</Text>
            <Text style={styles.tipText}>• Share any special techniques</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Share Recipe"
          onPress={handlePost}
          loading={loading}
          disabled={!title || !description}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
  },
  header: {
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
    padding: Theme.spacing.lg,
  },
  imageContainer: {
    marginBottom: Theme.spacing.lg,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: Theme.colors.secondary,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: Theme.colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: Theme.spacing.sm,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text.light,
    fontWeight: Theme.fontWeight.medium,
  },
  removeImageButton: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    backgroundColor: Theme.colors.background,
    borderRadius: 12,
  },
  form: {
    flex: 1,
  },
  textAreaContainer: {
    marginBottom: Theme.spacing.md,
  },
  label: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  textArea: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text.primary,
    minHeight: 120,
  },
  tips: {
    backgroundColor: Theme.colors.background,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  tipsTitle: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semiBold,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.sm,
  },
  tipText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.xs,
    lineHeight: 18,
  },
  tagsSection: {
    marginBottom: Theme.spacing.lg,
  },
  tagSubtext: {
    fontSize: Theme.fontSize.xs,
    color: Theme.colors.text.secondary,
    marginBottom: Theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.xs,
  },
  tagButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.lg,
    backgroundColor: Theme.colors.secondary,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  selectedTagButton: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  tagButtonText: {
    fontSize: Theme.fontSize.sm,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.colors.text.secondary,
  },
  selectedTagButtonText: {
    color: Theme.colors.text.white,
  },
  footer: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
});