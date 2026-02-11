import { io, type Socket } from 'socket.io-client';

import { getAccessToken } from './tokenManager';

class SocketService {
  private static instance: SocketService;
  private readonly baseURL: string;
  private socket: null | Socket = null;

  private constructor() {
    this.baseURL = (import.meta.env.VITE_BEASYBOX_API as string) || 'http://localhost:3000';
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): void {
    if (this.socket?.connected) return;

    const token = getAccessToken();

    this.socket = io(this.baseURL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public emit(event: string, data: unknown): void {
    if (!this.socket) {
      console.warn('Socket not initialized. Call connect() first.');
      return;
    }
    this.socket.emit(event, data);
  }

  public off(event: string): void {
    this.socket?.off(event);
  }

  public on(event: string, callback: (data: unknown) => void): void {
    if (!this.socket) {
      console.warn('Socket not initialized. Call connect() first.');
      return;
    }
    this.socket.on(event, callback);
  }
}

export default SocketService.getInstance();
