// src/components/SocketInitializer.tsx
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { taskGateway } from "@/services/gateway/TaskGateway";
import { tokenService } from "@/utils/tokenService";
import api from "@/services/api";

function SocketInitializer() {
  const token = useAppSelector((state) => state.auth.accessToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  /**
   * Connect / Disconnect lifecycle
   */
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    console.log(" Initializing socket with token", token.slice(0, 10) + "...");

    taskGateway.connect(token);

    const socket = taskGateway.getSocket();
    if (!socket) return;

    const onConnect = () => {
      console.log(" Socket connected:", socket.id);
    };

    const onDisconnect = (reason: string) => {
      console.warn(" Socket disconnected:", reason);
    };

    const onError = (err: unknown) => {
      if (err instanceof Error) {
        console.error(" Socket error:", err.message);
      } else {
        console.error(" Socket error:", err);
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onError);
    socket.on("connect_error", async (err) => {
      if (err.message === "Invalid or expired token") {
        try {
          const { data } = await api.put("/auth/sessions/current", {});
          tokenService.setToken(data.accessToken);

          socket.auth = {
            token: data.accessToken,
          };

          socket.connect();
        } catch {
          tokenService.clearToken();
        }
      }
    });
    socket.on("task:created", (task) => {
      console.log("SOCKET RECEIVED", task.id);
    });
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onError);

      taskGateway.disconnect();
    };
  }, [isAuthenticated]);

  /**
   * Token refresh handling
   */
  useEffect(() => {
    if (!token) return;

    taskGateway.updateToken(token);
  }, [token]);

  return null;
}

export default SocketInitializer;
