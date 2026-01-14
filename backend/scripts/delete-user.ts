import { connectMongo, disconnectMongo } from "../src/lib/mongo";
import { User } from "../src/models/User";
import { Feedback } from "../src/models/Feedback";
import { EmailVerificationCode } from "../src/models/EmailVerificationCode";

const email = process.argv[2];

if (!email) {
  console.error("Usage: ts-node scripts/delete-user.ts <email>");
  process.exit(1);
}

async function deleteUser() {
  try {
    console.log(`[Delete User] Connecting to database...`);
    await connectMongo();

    const normalizedEmail = email.toLowerCase().trim();
    console.log(`[Delete User] Looking for user: ${normalizedEmail}`);

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log(`[Delete User] User not found: ${normalizedEmail}`);
      await disconnectMongo();
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

    await disconnectMongo();
    console.log(`[Delete User] Done.`);
  } catch (error) {
    console.error(`[Delete User] Error:`, error);
    await disconnectMongo();
    process.exit(1);
  }
}

deleteUser();

