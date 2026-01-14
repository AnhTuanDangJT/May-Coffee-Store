require("dotenv").config();
const mongoose = require("mongoose");

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/delete-user.js <email>");
  process.exit(1);
}

async function deleteUser() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("[Delete User] Missing MONGODB_URI in environment");
      process.exit(1);
    }

    console.log(`[Delete User] Connecting to database...`);
    await mongoose.connect(mongoUri);
    console.log(`[Delete User] Connected successfully.`);

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[Delete User] Looking for user: ${normalizedEmail}`);

    // Import models
    const User = mongoose.model(
      "User",
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );
    const Feedback = mongoose.model(
      "Feedback",
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );
    const EmailVerificationCode = mongoose.model(
      "EmailVerificationCode",
      new mongoose.Schema({}, { strict: false, timestamps: true })
    );

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log(`[Delete User] User not found: ${normalizedEmail}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log(`[Delete User] Found user: ${user.name} (${user.email})`);
    console.log(`[Delete User] User ID: ${user._id}`);

    // Delete related records
    console.log(`[Delete User] Deleting related feedback...`);
    const feedbackResult = await Feedback.deleteMany({ user: user._id });
    console.log(`[Delete User] Deleted ${feedbackResult.deletedCount} feedback entries`);

    console.log(`[Delete User] Deleting related verification codes...`);
    const codeResult = await EmailVerificationCode.deleteMany({ user: user._id });
    console.log(`[Delete User] Deleted ${codeResult.deletedCount} verification codes`);

    // Delete the user
    console.log(`[Delete User] Deleting user...`);
    await User.deleteOne({ _id: user._id });
    console.log(`[Delete User] ✓ User deleted successfully!`);

    await mongoose.disconnect();
    console.log(`[Delete User] Done.`);
  } catch (error) {
    console.error(`[Delete User] Error:`, error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

deleteUser();















