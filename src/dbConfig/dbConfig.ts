import mongoose from "mongoose";

export async function connectDB(){
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Connected to MongoDB :)");
        })

        connection.on("error", (error) => {
            console.log("MongoDB Connection Error :(, Please check if the DB is running! ");
            console.log("ERROR:: "+error);
            process.exit();
        })
    } catch (error) {
        console.log('DB Connection Error!!');
        console.log(error);
    }
}