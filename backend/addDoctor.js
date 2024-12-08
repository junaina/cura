const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Models
const User = require("./models/User");
const Doctor = require("./models/Doctor");
const Availability = require("./models/Availability");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Doctor data 1: Dr. Alex Turner
const userData1 = {
  name: "Dr. Alex Turner",
  email: "alex.turner@cardiohealth.com",
  password: "securePassword456", // Plain text password (will be hashed)
  role: "doctor",
  isGoogleUser: false, // assuming it's not a Google login
  created_at: new Date(),
  updated_at: new Date(),
};

// Hash the password for Dr. Alex Turner before saving it
bcrypt.hash(userData1.password, 10, async (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  // Replace the plain password with the hashed password
  userData1.password = hashedPassword;

  try {
    // Step 1: Create Dr. Alex Turner user
    const newUser1 = new User(userData1);
    await newUser1.save();

    // Step 2: Create Dr. Alex Turner's doctor data
    const doctorData1 = {
      user_id: newUser1._id, // Reference to the User
      specialization: "Cardiologist",
      experience: 10,
      medicalLicenseNumber: "CL987654",
      contactNumber: "555-123-4567",
      city: "Los Angeles",
      gender: "male",
      dob: new Date("1985-03-12"),
      about:
        "A seasoned Cardiologist with over 10 years of experience in treating heart conditions.",
      status: "approved",
      availability: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    const newDoctor1 = new Doctor(doctorData1);
    await newDoctor1.save();

    // Step 3: Insert availability for Dr. Alex Turner
    const availabilityData1 = [
      {
        doctor_id: newDoctor1._id, // Reference to the Doctor
        day: "Tuesday", // Available on Tuesday
        start_time: "10:00 AM", // Start time
        end_time: "11:00 AM", // End time
      },
      {
        doctor_id: newDoctor1._id,
        day: "Thursday", // Available on Thursday
        start_time: "01:00 PM", // Start time
        end_time: "02:00 PM", // End time
      },
    ];

    // Save the availability data for Dr. Alex Turner
    const availability1 = await Availability.insertMany(availabilityData1);

    // Step 4: Update Dr. Alex Turner's document to include availability
    await Doctor.findByIdAndUpdate(
      newDoctor1._id,
      {
        $push: {
          availability: { $each: availability1.map((avail) => avail._id) },
        },
      },
      { new: true }
    );

    console.log("Dr. Alex Turner added successfully with hashed password!");

    // **Add Dr. Emily Davis here**

    // Doctor data 2: Dr. Emily Davis
    const userData2 = {
      name: "Dr. Emily Davis",
      email: "emily.davis@healthcare.com",
      password: "securePassword789", // Plain text password (will be hashed)
      role: "doctor",
      isGoogleUser: false, // assuming it's not a Google login
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Hash the password for Dr. Emily Davis before saving it
    bcrypt.hash(userData2.password, 10, async (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return;
      }

      // Replace the plain password with the hashed password
      userData2.password = hashedPassword;

      try {
        // Step 1: Create Dr. Emily Davis user
        const newUser2 = new User(userData2);
        await newUser2.save();

        // Step 2: Create Dr. Emily Davis's doctor data
        const doctorData2 = {
          user_id: newUser2._id, // Reference to the User
          specialization: "Pediatrician",
          experience: 12,
          medicalLicenseNumber: "CL123789",
          contactNumber: "555-987-1234",
          city: "Chicago",
          gender: "female",
          dob: new Date("1984-11-23"),
          about:
            "Passionate Pediatrician with over a decade of experience in child healthcare.",
          status: "approved",
          availability: [],
          created_at: new Date(),
          updated_at: new Date(),
        };

        const newDoctor2 = new Doctor(doctorData2);
        await newDoctor2.save();

        // Step 3: Insert availability for Dr. Emily Davis
        const availabilityData2 = [
          {
            doctor_id: newDoctor2._id, // Reference to the Doctor
            day: "Monday", // Available on Monday
            start_time: "08:00 AM", // Start time
            end_time: "09:00 AM", // End time
          },
          {
            doctor_id: newDoctor2._id,
            day: "Friday", // Available on Friday
            start_time: "03:00 PM", // Start time
            end_time: "04:00 PM", // End time
          },
        ];

        // Save the availability data for Dr. Emily Davis
        const availability2 = await Availability.insertMany(availabilityData2);

        // Step 4: Update Dr. Emily Davis's document to include availability
        await Doctor.findByIdAndUpdate(
          newDoctor2._id,
          {
            $push: {
              availability: { $each: availability2.map((avail) => avail._id) },
            },
          },
          { new: true }
        );

        console.log("Dr. Emily Davis added successfully with hashed password!");
        mongoose.disconnect(); // Close the connection
      } catch (err) {
        console.error("Error inserting Dr. Emily Davis:", err);
        mongoose.disconnect(); // Close the connection on error
      }
    });
  } catch (err) {
    console.error("Error inserting Dr. Alex Turner:", err);
    mongoose.disconnect(); // Close the connection on error
  }
});
