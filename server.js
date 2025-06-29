
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;
const cors = require('cors');

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

//  Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" MongoDB connected"))
.catch(err => console.error(" MongoDB connection error:", err));

// Import User model
const User = require('./models/user');
const Booking = require('./models/Booking');
//  Register Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Account created', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

//  Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      console.log(' Received data:', user);
      res.status(200).json({ message: 'Login successful', userId: user._id });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login error' });
  }
});

//  Hotel Booking API
app.post('/bookings', async (req, res) => {
  const { hotelName, checkInDate, checkOutDate,userId} = req.body;

  try {
    const newBooking = new Booking({ hotelName, checkInDate, checkOutDate,userId});
    await newBooking.save();

    console.log(' Booking saved:', newBooking);
    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } catch (err) {
    console.error(' Booking error:', err);
    res.status(500).json({ error: 'Booking failed' });
  }
});

//add cart
app.get('/get-cart-items/:userId', async (req, res) => {
  const { userId } = req.params;
  const userBookings = await Booking.find({ userId });
  res.status(200).json(userBookings);
});

app.post('/logout', (req, res) => {
  // Normally: destroy session / clear cookie
  res.status(200).json({ message: 'Logged out successfully' });
});

// app.get('/get-cart-items/:userId', async (req, res) => {
// try {
//     const bookings = await Booking.find({ userId: req.params.userId });
//     res.status(200).json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching bookings' });
//   }
// });

// Assuming you're using MongoDB and Mongoose
app.delete('/addcart/:id', async (req, res) => {
  try {
    const deletedItem = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error(' Error deleting booking:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});


// app.get('/addcart', async (req, res) => {
//   try {
//     const allBookings = await Booking.find();
//     res.status(200).json(allBookings);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch bookings' });
//   }
// });





app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// app.post('/bookings', async (req, res) => {
//   const { hotelName, checkInDate, checkOutDate } = req.body;

//   try {
//     const newBooking = new Booking({ hotelName, checkInDate, checkOutDate });
//     await newBooking.save();

//     console.log('✅ Booking saved:', newBooking);
//     res.status(201).json({ message: 'Booking successful', booking: newBooking });
//   } catch (err) {
//     console.error('❌ Booking error:', err);
//     res.status(500).json({ error: 'Booking failed' });
//   }
// });

// app.post('/api/bookings/add', async (req, res) => {
//   const { hotelName, checkInDate, checkOutDate } = req.body;
  
//   try {
//     const booking = new Booking({ hotelName, checkInDate, checkOutDate, userEmail });
//     await booking.save();
//     res.status(201).json({ message: 'Booking added successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add booking' });
//   }
// });

// 🧪 Test route
// app.get('/', (req, res) => {
//   res.send('API is working!');
// });

// app.get('/', (req, res) => {
//   res.send('✅ Hello! GET is working.');
// });

// app.post('/test', (req, res) => {
//   console.log('📦 Received data:', req.body);
//   res.send('✅ POST is working. Check console for data.');
// });

// ✅ Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
