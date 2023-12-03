const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/Data', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a MongoDB Model for the "Admin" collection
const AdminModel = mongoose.model('Admin', {
  adminname: String,
});

// Create a MongoDB Model for the "Course" collection
const CourseModel = mongoose.model('Course', {
  courseID: String,
  courseName: String,
  batch: String,
});

// Middleware for parsing JSON
app.use(bodyParser.json());

// POST Route for Saving a New Admin
app.post('/add-admin', async (req, res) => {
  const { adminname } = req.body;

  try {
    const existingAdmin = await AdminModel.findOne({ adminname });

    if (existingAdmin) {
      res.status(400).json({ message: 'Admin with the same name already exists' });
    } else {
      const newAdmin = new AdminModel({ adminname });
      await newAdmin.save();
      res.status(201).json({ message: 'New admin saved successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error saving new admin' });
  }
});

// POST Route for Updating Admin Name
app.post('/update-admin', async (req, res) => {
  const adminname = "ravi"; // Provide the new admin name

  try {
    const admin = await AdminModel.findOne();
    admin.adminname = adminname;
    await admin.save();

    res.status(200).json({ message: 'Admin name updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin name' });
  }
});

// POST Route for Saving a New Course
app.post('/add-course', async (req, res) => {
  console.log('TEST');
  const { courseID, courseName, batch } = req.body;
  console.log(courseID, courseName, batch);

  try {
    const existingCourse = await CourseModel.findOne({ courseID });

    if (existingCourse) {
      res.status(400).json({ message: 'Course with the same ID already exists' });
    } else {
      const newCourse = new CourseModel({ courseID, courseName, batch });
      await newCourse.save();
      res.status(201).json({ message: 'New course saved successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error saving new course' });
  }
});


// Add more routes for updating, deleting, and retrieving courses as needed.

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});















// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // MongoDB Connection
// mongoose.connect('mongodb://127.0.0.1:27017/Data', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// // Create a MongoDB Model
// const AdminModel = mongoose.model('Admin', {
//   adminname: String,
// });


// // Middleware for parsing JSON
// app.use(bodyParser.json());
// // POST Route for Saving a New Admin
// // GET Route for Adding a New Admin
// app.post('/add-admin', async (req, res) => {
//   console.log("this is add");
//   const {adminname }= req.body; // Provide the admin name you want to add

//   try {
//     // Check if an admin with the same name already exists
//     const existingAdmin = await AdminModel.findOne({ adminname });

//     if (existingAdmin) {
//       res.status(400).json({ message: 'Admin with the same name already exists' });
//     } else {
//       // Create a new admin document and save it to the database
//       const newAdmin = new AdminModel({ adminname });
//       await newAdmin.save();
//       res.status(201).json({ message: 'New admin saved successfully' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error saving new admin' });
//   }
// });


// // POST Route for Updating Admin Name
// app.post('/update-admin', async (req, res) => {
//   // const { adminname } = "ravi";
//   const adminname  = "ravi";

//   try {
//     // Find the admin and update the name
//     const admin = await AdminModel.findOne();
//     admin.adminname = adminname;
//     await admin.save();

//     res.status(200).json({ message: 'Admin name updated successfully' });
//   }catch (error) {
//     res.status(500).json({ message: 'Error updating admin name' });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
