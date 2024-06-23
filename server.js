const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

// Define Project Schema
const projectSchema = new mongoose.Schema({
  name: String,
  tasks: Array,
  userId: mongoose.Schema.Types.ObjectId
});

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);

// User Registration
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({ id: user._id }, SECRET_KEY);
    res.json({ token });
  } catch (error) {
    res.status(400).send('Error logging in');
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send('No token provided');
  }
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).send('Failed to authenticate token');
    }
    req.userId = decoded.id;
    next();
  });
};

// Create Project
app.post('/projects', verifyToken, async (req, res) => {
  const { name, tasks } = req.body;
  const project = new Project({ name, tasks, userId: req.userId });
  await project.save();
  res.status(201).send('Project created');
});

// Get Projects
app.get('/projects', verifyToken, async (req, res) => {
  const projects = await Project.find({ userId: req.userId });
  res.json(projects);
});

// Delete Project
app.delete('/projects/:id', verifyToken, async (req, res) => {
  await Project.deleteOne({ _id: req.params.id, userId: req.userId });
  res.send('Project deleted');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
