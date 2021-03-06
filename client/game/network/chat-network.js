import { Chat } from "ui/chat/chat";
import { socket } from "./network";

const eChatMessage = "chat-message";

class ChatNetwork {
    static send(content) 
    {
        socket.emit(eChatMessage, content);
    }
}

// listen to event
socket.on(eChatMessage, (event) => {
    Chat.msgUser(event.id, event.content);
});

export { ChatNetwork };
