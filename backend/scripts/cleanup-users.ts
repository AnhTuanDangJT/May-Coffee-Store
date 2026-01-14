import { connectMongo, disconnectMongo } from "../src/lib/mongo";
import { User } from "../src/models/User";
import { Feedback } from "../src/models/Feedback";
import { EmailVerificationCode } from "../src/models/EmailVerificationCode";
import { BOOTSTRAP_ADMIN_EMAIL } from "../src/utils/constants";

async function cleanupUsers() {
  try {
    console.log(`[Cleanup Users] Connecting to database...`);
    await connectMongo();

    // Find admin user
    const adminUser = await User.findOne({ email: BOOTSTRAP_ADMIN_EMAIL });
    
    if (!adminUser) {
      console.log(`[Cleanup Users] Admin user not found: ${BOOTSTRAP_ADMIN_EMAIL}`);
      console.log(`[Cleanup Users] Creating admin user...`);
      
      // You'll need to create the admin user manually or use a different approach
      console.log(`[Cleanup Users] Please create the admin user first`);
      await disconnectMongo();
      process.exit(1);
    }

    console.log(`[Cleanup Users] Found admin user: ${adminUser.name} (${adminUser.email})`);
    console.log(`[Cleanup Users] Admin role: ${adminUser.role}`);
    console.log(`[Cleanup Users] Admin verified: ${adminUser.isEmailVerified}`);

    // Ensure admin is verified and has admin role
    if (!adminUser.isEmailVerified || adminUser.role !== "admin") {
      console.log(`[Cleanup Users] Updating admin user to be verified and have admin role...`);
      adminUser.isEmailVerified = true;
      adminUser.role = "admin";
      await adminUser.save();
      console.log(`[Cleanup Users] ✓ Admin user updated`);
    }

    // Find all non-admin users (users that are not admin)
    const nonAdminUsers = await User.find({
      $and: [
        { email: { $ne: BOOTSTRAP_ADMIN_EMAIL } },
        { role: { $ne: "admin" } }
      ]
    });

    console.log(`[Cleanup Users] Found ${nonAdminUsers.length} non-admin users to delete`);

    if (nonAdminUsers.length === 0) {
      console.log(`[Cleanup Users] No users to delete`);
      await disconnectMongo();
      console.log(`[Cleanup Users] Done.`);
      process.exit(0);
    }

    // Delete related data for each user
    for (const user of nonAdminUsers) {
      console.log(`[Cleanup Users] Deleting user: ${user.name} (${user.email})`);
      
      // Delete feedback
      const feedbackResult = await Feedback.deleteMany({ user: user._id });
      console.log(`  - Deleted ${feedbackResult.deletedCount} feedback entries`);
      
      // Delete verification codes
      const codeResult = await EmailVerificationCode.deleteMany({ user: user._id });
      console.log(`  - Deleted ${codeResult.deletedCount} verification codes`);
      
      // Delete the user
      await User.deleteOne({ _id: user._id });
      console.log(`  - User deleted`);
    }

    console.log(`[Cleanup Users] ✓ Deleted ${nonAdminUsers.length} users`);
    
    // Verify admin still exists and is correct
    const adminCheck = await User.findOne({ email: BOOTSTRAP_ADMIN_EMAIL });
    if (adminCheck) {
      console.log(`[Cleanup Users] ✓ Admin user verified: ${adminCheck.email}`);
      console.log(`[Cleanup Users]   - Role: ${adminCheck.role}`);
      console.log(`[Cleanup Users]   - Verified: ${adminCheck.isEmailVerified}`);
    } else {
      console.error(`[Cleanup Users] ERROR: Admin user not found after cleanup!`);
    }

    await disconnectMongo();
    console.log(`[Cleanup Users] Done.`);
  } catch (error) {
    console.error(`[Cleanup Users] Error:`, error);
    await disconnectMongo();
    process.exit(1);
  }
}

cleanupUsers();

