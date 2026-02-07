import { useEffect, useState, useRef } from 'react'

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [status, setStatus] = useState('Disconnected')
    const ws = useRef(null)

    useEffect(() => {
        // 1. Obtenemos la URL del Backend desde la variable de entorno
        // Si no existe (estás en local), usa localhost:8000
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

        // 2. Convertimos http/https a ws/wss para WebSockets
        // Esto cambia 'https://mi-backend.com' a 'wss://mi-backend.com/ws'
        const wsUrl = apiUrl.replace(/^http/, 'ws') + '/ws';

        console.log("Conectando a:", wsUrl); // Para depurar

        ws.current = new WebSocket(wsUrl)

        ws.current.onopen = () => {
            setStatus('Connected')
            console.log('Connected to WebSocket')
        }

        ws.current.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data])
        }

        ws.current.onclose = () => {
            setStatus('Disconnected')
            console.log('Disconnected from WebSocket')
        }

        return () => {
            if (ws.current) {
                ws.current.close()
            }
        }
    }, [])

    const sendMessage = (e) => {
        e.preventDefault()
        if (ws.current && inputValue) {
            ws.current.send(inputValue)
            setInputValue('')
        }
    }

    return (
        <div className="chat-container">
            <h1>Chat ({status})</h1>
            <div className="messages-list">
                {messages.map((msg, index) => (
                    <div key={index} className="message-item">
                        {msg}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="chat-form">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit" disabled={status !== 'Connected'}>
                    Send
                </button>
            </form>
        </div>
    )
}
