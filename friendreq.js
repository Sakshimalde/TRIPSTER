import express from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);

// Friend Request Schema
const friendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

// Routes

// Send a friend request
app.post('/api/friends/send-request', async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    // Validate input
    if (!senderId || !recipientId) {
      return res.status(400).json({ message: 'Both senderId and recipientId are required' });
    }

    // Check if users exist
    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipientId)
    ]);

    if (!sender || !recipient) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Check if a request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: senderId, recipient: recipientId, status: 'pending' },
        { sender: recipientId, recipient: senderId, status: 'pending' }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already exists' });
    }

    // Create new friend request
    const newRequest = new FriendRequest({
      sender: senderId,
      recipient: recipientId
    });

    await newRequest.save();
    res.status(201).json({ message: 'Friend request sent successfully', request: newRequest });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({ message: 'Error sending friend request', error: error.message });
  }
});

// Accept a friend request
app.post('/api/friends/accept-request', async (req, res) => {
  try {
    const { requestId, userId } = req.body;

    // Validate input
    if (!requestId || !userId) {
      return res.status(400).json({ message: 'Both requestId and userId are required' });
    }

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Friend request already processed' });
    }

    if (request.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    // Update request status
    request.status = 'accepted';
    await request.save();

    // Add users to each other's friend lists
    await Promise.all([
      User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.recipient } }),
      User.findByIdAndUpdate(request.recipient, { $addToSet: { friends: request.sender } })
    ]);

    res.json({ message: 'Friend request accepted', request });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ message: 'Error accepting friend request', error: error.message });
  }
});

// Reject a friend request
app.post('/api/friends/reject-request', async (req, res) => {
  try {
    const { requestId, userId } = req.body;

    // Validate input
    if (!requestId || !userId) {
      return res.status(400).json({ message: 'Both requestId and userId are required' });
    }

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Friend request already processed' });
    }

    if (request.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    // Update request status
    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Friend request rejected', request });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({ message: 'Error rejecting friend request', error: error.message });
  }
});

// Get all pending friend requests for a user
app.get('/api/friends/requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate input
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }

    const requests = await FriendRequest.find({
      recipient: userId,
      status: 'pending'
    }).populate('sender', 'name username');

    res.json({ requests });
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    res.status(500).json({ message: 'Error fetching friend requests', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Example usage
async function createUsers() {
  try {
    const user1 = new User({ name: 'Alice', username: 'alice123' });
    const user2 = new User({ name: 'Bob', username: 'bob456' });
    await Promise.all([user1.save(), user2.save()]);
    console.log('Users created:', user1, user2);

    // Send a friend request
    const request = new FriendRequest({
      sender: user1._id,
      recipient: user2._id
    });
    await request.save();
    console.log('Friend request sent:', request);
  } catch (error) {
    console.error('Error in example usage:', error);
  }
}

createUsers();