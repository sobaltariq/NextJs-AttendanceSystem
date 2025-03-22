import { useMessageModal } from "@/components/modal/providers/MessageModalProvider";
import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
}

const useSocket = ({ onConnect, onDisconnect, onError }: UseSocketOptions) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  // to show any message popup
  const { showMessageModal } = useMessageModal();

  useEffect(() => {
    const loggedInToken = localStorage.getItem("loggedInToken"); // Moved inside useEffect

    if (!loggedInToken) {
      console.error("No loggedInToken found in localStorage.");
      return;
    }

    // console.log("socketRef.current", socketRef.current);

    if (!socketRef.current || !socketRef.current.connected) {
      console.log(
        "55555555555555555555555555555555555555555",
        socketRef.current
      );

      // Initialize the socket connection only if it's not already created
      const newSocket = io(`${process.env.REACT_APP_BASE_URL}`, {
        transports: ["websocket"], // Use WebSocket transport
        auth: {
          token: `Bearer ${loggedInToken}`,
        },
        reconnection: true, // Enable automatic reconnection
        reconnectionAttempts: 5, // Number of reconnection attempts
        reconnectionDelay: 1000, // Delay between reconnection attempts
        reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
      });

      socketRef.current = newSocket;

      // Event: Connection established
      const handleConnect = () => {
        console.log("Connected to WebSocket server");
        setIsConnected(true);
        onConnect?.(); // Call the optional onConnect callback
      };

      // Event: Connection lost
      const handleDisconnect = (reason: string) => {
        console.log("Disconnected from WebSocket server, Reason:", reason);
        showMessageModal("error", reason, 5000);
        setIsConnected(false);
        onDisconnect?.(reason); // Call the optional onDisconnect callback
      };

      // Event: Connection error
      const handleError = (error: Error) => {
        console.error("WebSocket connection error:", error);
        showMessageModal("error", error.message, 5000);
        onError?.(error); // Call the optional onError callback
      };

      // Attach event listeners
      newSocket.on("connect", handleConnect);
      newSocket.on("disconnect", handleDisconnect);
      newSocket.on("connect_error", handleError);

      return () => {
        newSocket.off("connect", handleConnect);
        newSocket.off("disconnect", handleDisconnect);
        newSocket.off("connect_error", handleError);
        newSocket.disconnect(); // Disconnect socket when unmounting.
      };
    }
  }, [onDisconnect, onError]);

  // Emit a custom event
  const emitEvent = useCallback(
    <T,>(event: string, data?: T) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, data);
      } else {
        console.error("Socket is not connected.");
        showMessageModal("error", "network error", 5000);
      }
    },
    [isConnected]
  );

  // Listen to a custom event
  const onEvent = useCallback(
    <T,>(event: string, callback: (data: T) => void) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      } else {
        console.error("Socket is not initialized.");
        showMessageModal("error", "network error", 5000);
      }
    },
    []
  );

  // Remove a custom event listener
  const offEvent = useCallback((event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    } else {
      console.error("Socket is not initialized.");
      showMessageModal("error", "network error", 5000);
    }
  }, []);

  // Manually reconnect the socket
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.connect();
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    emitEvent,
    onEvent,
    offEvent,
    reconnect,
  };
};

export default useSocket;
