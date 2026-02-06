import os
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for simplicity in this setup, or restrict to frontend host
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sockets: list[WebSocket] = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    sockets.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            for socket in sockets:
                try:
                    await socket.send_text(f"Mensaje recibido: {data}")
                except:
                    # Handle broken pipe if needed, usually WebSocketDisconnect covers it
                    pass
    except WebSocketDisconnect:
        sockets.remove(websocket)
