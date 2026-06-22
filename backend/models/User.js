import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { 
        type: String, 
        enum: ['consumer', 'verified_owner', 'brand_rep', 'admin'], 
        default: 'consumer' 
    },
    reputationScore: { type: Number, default: 0 }
}, { timestamps: true });

// Pre-save middleware to hash passwords (UPDATED FOR MONGOOSE 8.x)
userSchema.pre('save', async function() {
    // If the password hasn't been modified, just return and let Mongoose proceed
    if (!this.isModified('password')) return;
    
    // Otherwise, hash the new password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to verify passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);