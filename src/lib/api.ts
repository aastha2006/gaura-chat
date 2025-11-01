export async function sendMessageToCloud(message: string, sessionId: string): Promise<string> {
  const base = import.meta.env.VITE_API_BASE_URL

  const payload = {
    message,
    session_id: sessionId, // ✅ send persistent ID like your website chatbot
  }

  console.log('📨 Sending to backend:', payload)

  const res = await fetch(`${base}/chatbot/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('❌ Cloud request failed:', errorText)
    throw new Error('Network error')
  }

  const data = await res.json()
  console.log('✅ Cloud reply:', data)
  return data.response
}

