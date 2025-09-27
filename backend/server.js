const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock data for development
let users = [
  { id: 1, username: 'foodie123', email: 'foodie@example.com', followers: 150, following: 75, posts: 12 },
  { id: 2, username: 'chef_master', email: 'chef@example.com', followers: 320, following: 100, posts: 25 }
];

let recipes = [
  {
    id: 1,
    userId: 1,
    title: 'Chocolate Chip Cookies',
    description: 'Classic homemade cookies',
    image: 'https://via.placeholder.com/300x200',
    likes: 45,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    userId: 2,
    title: 'Beef Tacos',
    description: 'Authentic Mexican tacos',
    image: 'https://via.placeholder.com/300x200',
    likes: 78,
    createdAt: new Date().toISOString()
  }
];

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ success: true, user, token: 'mock-jwt-token' });
  } else {
    res.status(401).json({ success: false, message: 'User not found' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, email } = req.body;
  const newUser = {
    id: users.length + 1,
    username,
    email,
    followers: 0,
    following: 0,
    posts: 0
  };
  users.push(newUser);
  res.json({ success: true, user: newUser, token: 'mock-jwt-token' });
});

// Recipe routes
app.get('/api/recipes', (req, res) => {
  const recipesWithUsers = recipes.map(recipe => ({
    ...recipe,
    user: users.find(u => u.id === recipe.userId)
  }));
  res.json(recipesWithUsers);
});

app.post('/api/recipes', (req, res) => {
  const { title, description, image, userId } = req.body;
  const newRecipe = {
    id: recipes.length + 1,
    userId,
    title,
    description,
    image,
    likes: 0,
    createdAt: new Date().toISOString()
  };
  recipes.push(newRecipe);

  // Update user's post count
  const user = users.find(u => u.id === userId);
  if (user) user.posts++;

  res.json({ success: true, recipe: newRecipe });
});

app.post('/api/recipes/:id/like', (req, res) => {
  const recipeId = parseInt(req.params.id);
  const recipe = recipes.find(r => r.id === recipeId);
  if (recipe) {
    recipe.likes++;
    res.json({ success: true, likes: recipe.likes });
  } else {
    res.status(404).json({ success: false, message: 'Recipe not found' });
  }
});

// User routes
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  if (user) {
    const userRecipes = recipes.filter(r => r.userId === userId);
    res.json({ ...user, recipes: userRecipes });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

app.get('/api/leaderboard', (req, res) => {
  const leaderboard = users
    .map(user => ({
      ...user,
      totalLikes: recipes
        .filter(r => r.userId === user.id)
        .reduce((sum, r) => sum + r.likes, 0)
    }))
    .sort((a, b) => b.totalLikes - a.totalLikes);

  res.json(leaderboard);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});