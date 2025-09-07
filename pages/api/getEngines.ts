import type { NextApiRequest, NextApiResponse } from 'next'

type Option = {
  value: string
  label: string
}

type Data = {
  modelOptions: Option[]
}

const freeModels: Option[] = [
  { value: 'gemini-1.5-flash', label: 'Google Gemini 1.5 Flash' },
  { value: 'gemini-2.5-flash', label: 'Google Gemini 2.5 Flash' }
  // Add more known free or public models here as needed
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  // Optionally, you might validate API keys or user auth here

  // Return only the predefined list of free models
  res.status(200).json({ modelOptions: freeModels })
}
