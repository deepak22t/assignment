"""Chatbot API routes"""
from fastapi import APIRouter
from models.schemas import ChatMessageRequest, ChatResponse, ChatHistoryResponse, ChatMessage, PropertyResponse
from services.chatbot_service import chatbot_service

router = APIRouter(prefix="/api/chat", tags=["chatbot"])


@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatMessageRequest):
    """Chatbot endpoint that processes user messages and returns property recommendations"""
    user_id = request.user_id or "default"
    return chatbot_service.process_message(request.message, user_id)


@router.get("/history/{user_id}", response_model=ChatHistoryResponse)
async def get_chat_history(user_id: str = "default"):
    """Get chat history for a user"""
    history = chatbot_service.get_chat_history(user_id)
    messages = []
    for msg in history:
        # Convert properties from dict to PropertyResponse if needed
        properties = []
        if msg.get("properties"):
            for prop in msg.get("properties", []):
                if isinstance(prop, dict):
                    properties.append(PropertyResponse(**prop))
                else:
                    properties.append(prop)
        
        messages.append(
            ChatMessage(
                id=msg.get("id", ""),
                type=msg.get("type", "bot"),
                text=msg.get("text", ""),
                timestamp=msg.get("timestamp", ""),
                properties=properties,
                isError=msg.get("isError", False)
            )
        )
    return ChatHistoryResponse(messages=messages, count=len(messages))


@router.delete("/history/{user_id}")
async def clear_chat_history(user_id: str = "default"):
    """Clear chat history for a user"""
    success = chatbot_service.clear_chat_history(user_id)
    return {"success": success, "message": "Chat history cleared" if success else "Failed to clear history"}

