require('dotenv').config({ path: __dirname + '/.env' }); // explicit path
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  console.log('MONGO_URI:', process.env.MONGO_URI); // sanity check

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  const newUser = new User({
    name: 'Mohit',
    email: 'mohit@example.com',
    password: '123456'
  });

  await newUser.save();
  console.log('User saved successfully');
  await mongoose.disconnect();
}

test().catch(console.error);
