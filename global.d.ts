// global.d.ts
import mongoose from 'mongoose'

declare global {
  // Extend globalThis with a 'mongo' property
  var mongo: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

export {}
