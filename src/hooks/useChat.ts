import { useState, useEffect } from 'react'
import { sendMessageToCloud } from '../lib/api'
import { runLocalLLM } from '../workers/localWorker'
import { v4 as uuidv4 } from 'uuid'

export function useChat() {
  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string }[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [mode, setMode] = useState<'cloud' | 'local'>('cloud')
  const [sessionId, setSessionId] = useState<string | null>(null)

  // ✅ Load or create persistent session ID
  useEffect(() => {
    let storedId = localStorage.getItem('gaura_dualmind_session_id')
    if (!storedId) {
      const newId = uuidv4()
      localStorage.setItem('gaura_dualmind_session_id', newId)
      storedId = newId
      console.log('🆕 Created new DualMind session:', newId)
    } else {
      console.log('♻️ Using existing DualMind session:', storedId)
    }
    setSessionId(storedId)
  }, [])

  // ✅ Send message handler
  async function sendMessage(content: string) {
    if (!sessionId) {
      console.warn('⚠️ Session not ready yet.')
      return
    }

    const userMessage = { id: Date.now().toString(), role: 'user' as const, content }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      const reply =
        mode === 'cloud'
          ? await sendMessageToCloud(content, sessionId)
          : await runLocalLLM(content)

      setMessages(prev => [...prev, { id: userMessage.id + '-ai', role: 'assistant', content: reply }])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { id: 'error', role: 'assistant', content: '⚠️ Something went wrong.' }])
    } finally {
      setIsTyping(false)
    }
  }

  return { messages, sendMessage, isTyping, mode, setMode, sessionId }
}
