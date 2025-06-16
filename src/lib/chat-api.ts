export async function sendMessage(prompt: string, apiKey: string, onChunk: (chunk: string) => void): Promise<void> {
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${apiUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("No response body reader available")
  }

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      onChunk(chunk)
    }
  } finally {
    reader.releaseLock()
  }
}
