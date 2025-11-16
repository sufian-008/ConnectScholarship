const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');

dotenv.config();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Function to create fake data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Post.deleteMany();

    // Create users
    const password = await bcrypt.hash('123456', 10);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password,
      role: 'admin'
    });

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password,
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password,
      role: 'user'
    });

    // Create posts
    const posts = [
      {
        opportunity: 'Full Scholarship to USA',
        country: 'USA',
        fundingType: 'Full',
        deadline: new Date('2025-12-31'),
        officialLink: 'https://example.com/scholarship1',
        description: 'A fully funded scholarship to study in USA.',
        status: 'approved',
        author: user1._id,
        authorName: user1.name
      },
      {
        opportunity: 'Partial Scholarship for Canada',
        country: 'Canada',
        fundingType: 'Partial',
        deadline: new Date('2025-11-30'),
        officialLink: 'https://example.com/scholarship2',
        description: 'A partially funded scholarship to study in Canada.',
        status: 'pending',
        author: user2._id,
        authorName: user2.name
      },
      {
        opportunity: 'Research Grant in UK',
        country: 'UK',
        fundingType: 'None',
        deadline: new Date('2025-10-15'),
        officialLink: 'https://example.com/scholarship3',
        description: 'A research grant for international students.',
        status: 'rejected',
        author: user1._id,
        authorName: user1.name
      }
    ];

    await Post.insertMany(posts);

    console.log('Data seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
