class WebSocketManager {
    private static instance: WebSocketManager;
    private ws: WebSocket | null = null;
    private listeners: Set<(connected: boolean) => void> = new Set();
    private reconnectTimer: NodeJS.Timeout | null = null;
    private reconnectAttempts = 0;
    private readonly maxReconnectAttempts = 2;
    private readonly baseReconnectDelay = 1000;
  
    private constructor() {}
  
    static getInstance(): WebSocketManager {
      if (!WebSocketManager.instance) {
        WebSocketManager.instance = new WebSocketManager();
      }
      return WebSocketManager.instance;
    }
  
    private clearReconnectTimer() {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    }
  
    connect() {
      if (this.ws?.readyState === WebSocket.CONNECTING) return;
      if (this.ws?.readyState === WebSocket.OPEN) return;
      
      this.clearReconnectTimer();
      this.ws = new WebSocket('ws://localhost:8080');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.clearReconnectTimer();
        this.notifyListeners(true);
      };
  
      this.ws.onclose = () => {
        this.notifyListeners(false);
        this.scheduleReconnect();
      };
  
      this.ws.onerror = (error) => {
        error
        // console.error('WebSocket error:', error);
        this.notifyListeners(false);
      };
    }
  
    private scheduleReconnect() {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
      
      const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts);
      this.reconnectTimer = setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    }
  
    addListener(callback: (connected: boolean) => void) {
      this.listeners.add(callback);
      if (this.ws) {
        callback(this.ws.readyState === WebSocket.OPEN);
      }
    }
  
    removeListener(callback: (connected: boolean) => void) {
      this.listeners.delete(callback);
    }
  
    private notifyListeners(connected: boolean) {
      this.listeners.forEach(listener => listener(connected));
    }
  
    send(data: any) {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(data));
      }
    }
  }
  
  export default WebSocketManager;