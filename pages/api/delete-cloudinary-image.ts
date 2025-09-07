// pages/api/delete-cloudinary-image.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).end()
  const { publicId } = req.body
  if (!publicId) return res.status(400).end()
  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true })
    if (result.result === 'ok') return res.status(200).end()
    return res.status(400).end()
  } catch {
    return res.status(500).end()
  }
}
