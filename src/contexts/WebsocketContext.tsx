import { createContext } from "react";
import { Socket, io } from "socket.io-client";

export const socket = io(
    import.meta.env.VITE_MODE === 'prod' ?
        import.meta.env.VITE_SERVER_PROD_PATH :
        import.meta.env.VITE_SERVER_DEV_PATH
);
export const WebsocketContext = createContext<Socket>(socket);

export const WebsocketProvider = WebsocketContext.Provider;