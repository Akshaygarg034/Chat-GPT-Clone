import type { NextApiRequest, NextApiResponse } from 'next'

type Option = {
  value: string
  label: string
  isDisabled?: boolean
}

type Data = {
  modelOptions: Option[]
}

const freeModels: Option[] = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro', isDisabled: true },
  { value: 'claude-opus-4.7', label: 'Claude Opus 4.7', isDisabled: true },
  { value: 'claude-sonnet', label: 'Claude Sonnet 4.6', isDisabled: true },
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
