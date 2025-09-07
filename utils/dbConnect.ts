// utils/dbConnect.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) {
throw new Error('Please define the MONGODB_URI environment variable in .env.local')
}

let cached = globalThis.mongo

if (!cached) {
cached = globalThis.mongo = { conn: null, promise: null }
}

async function dbConnect(): Promise<typeof mongoose> {
if (cached.conn) {
return cached.conn
}
if (!cached.promise) {
// Enable bufferCommands so queries wait for the connection to be established
const opts = { bufferCommands: true }
cached.promise = mongoose.connect(MONGODB_URI, opts).then(m => m)
}
cached.conn = await cached.promise
return cached.conn
}

export default dbConnect