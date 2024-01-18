import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "USER"
    }

}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
        next();
    }
    else {
        next();
    }
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
    //"this.password" is the hashed password in the database
    //"password" is the password that user entered
}
const User =   mongoose.models?.User || mongoose.model("User", userSchema);

export { User };