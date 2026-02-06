import { useEffect, useState, useRef } from 'react'

export default function Chat() {
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [status, setStatus] = useState('Disconnected')
    const ws = useRef(null)

    useEffect(() => {
        // Connect to WebSocket dynamically based on current protocol and host
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws`;

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
