// pages/api/models.ts
import type { NextApiRequest, NextApiResponse } from 'next'

type Option = {
  value: string
  label: string
}

type Data = {
  modelOptions: Option[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).end()
  }

  // Fetch model list directly via OpenAI REST API
  const response = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    return res.status(response.status).end()
  }

  const payload = await response.json()
  const models: { id: string }[] = payload.data || []

  const modelOptions: Option[] = models.map((m) => ({
    value: m.id,
    label: m.id,
  }))

  res.status(200).json({ modelOptions })
}

