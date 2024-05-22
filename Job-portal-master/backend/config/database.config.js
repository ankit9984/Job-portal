import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Database connect successfully'))
        .catch((err) => console.error('Databse: ', err))
    } catch (error) {
        console.error('Database: ', error);
        process.exit(1);
    };
};

export default connectDB;