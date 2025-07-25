export function connectWebSocket(): WebSocket {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/ws`;
  
  const socket = new WebSocket(wsUrl);
  
  socket.onopen = () => {
    console.log('WebSocket connected');
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  socket.onclose = (event) => {
    console.log('WebSocket disconnected:', event);
    
    // Implement reconnection logic
    if (!event.wasClean) {
      setTimeout(() => {
        console.log('Attempting to reconnect WebSocket...');
        connectWebSocket();
      }, 3000);
    }
  };
  
  return socket;
}

export function sendWebSocketMessage(socket: WebSocket, message: any) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn('WebSocket is not open. Message not sent:', message);
  }
}
