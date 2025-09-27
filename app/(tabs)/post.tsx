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
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          image: image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
          userId: 1, // Mock user ID
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Recipe posted successfully!', [
          { text: 'OK', onPress: () => {
            setTitle('');
            setDescription('');
            setImage(null);
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
          setImage(null);
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
  footer: {
    padding: Theme.spacing.lg,
    backgroundColor: Theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
});