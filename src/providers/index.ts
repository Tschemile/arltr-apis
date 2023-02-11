import connectCache from "./cache";
import connectDB from "./db";
import connectMail from "./mail";

const providers = [
  connectDB,
  connectCache,
  connectMail,
]

export default providers