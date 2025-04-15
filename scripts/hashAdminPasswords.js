const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Step 1: Connect to your MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/HealthMonitoringSystemDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB connected");
}).catch(err => {
    console.error("❌ MongoDB connection error:", err);
});

// Step 2: Define the Admin schema
const adminSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    username: String,
    password: String,
    role: String
});

const Admin = mongoose.model("admins", adminSchema);

// Step 3: Hash all plain text admin passwords
async function hashPasswords() {
    const admins = await Admin.find({});

    for (const admin of admins) {
        const alreadyHashed = admin.password.startsWith("$2b$");

        if (!alreadyHashed) {
            const hashed = await bcrypt.hash(admin.password, 10);
            admin.password = hashed;
            await admin.save();
            console.log(`🔐 Hashed password for admin: ${admin.username}`);
        } else {
            console.log(`ℹ️ Already hashed: ${admin.username}`);
        }
    }

    mongoose.connection.close();
}

hashPasswords();
