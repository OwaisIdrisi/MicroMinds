import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  getConversations,
  getConversation,
  sendMessage,
  startConversation,
  getUserByUsername,
} from "../api/chat";
import {
  setChatLoading,
  setChatError,
  setConversations,
  setActiveConversation,
  setMessages,
} from "../features/chatSlice";

const Chat = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { conversations, activeConversation, messages, loading, error } =
    useSelector((state) => state.chat);
  const [username, setUsername] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    loadConversations();
  }, [dispatch]);

  const loadConversations = async () => {
    dispatch(setChatLoading(true));
    try {
      const response = await getConversations();
      dispatch(setConversations(response.data.conversations || []));
      if (response.data.conversations?.length) {
        openConversation(response.data.conversations[0]._id);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load conversations";
      dispatch(setChatError(message));
      toast.error(message);
    } finally {
      dispatch(setChatLoading(false));
    }
  };

  const openConversation = async (conversationId) => {
    dispatch(setChatLoading(true));
    try {
      const response = await getConversation(conversationId);
      dispatch(setActiveConversation(response.data.conversation));
      dispatch(setMessages(response.data.messages || []));
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load conversation";
      dispatch(setChatError(message));
      toast.error(message);
    } finally {
      dispatch(setChatLoading(false));
    }
  };

  const startNewConversation = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      const userResponse = await getUserByUsername(username.trim());
      const targetUser = userResponse.data.user;
      const response = await startConversation(targetUser._id);
      const conversation = response.data.conversation;
      dispatch(setActiveConversation(conversation));
      dispatch(setConversations([conversation, ...conversations]));
      setUsername("");
      openConversation(conversation._id);
      toast.success("Conversation started");
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to start conversation";
      toast.error(message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation?._id) return;

    try {
      const response = await sendMessage(
        activeConversation._id,
        newMessage.trim(),
      );
      const nextMessage = response.data.message;
      dispatch(setMessages([...messages, nextMessage]));
      setNewMessage("");
      loadConversations();
    } catch (err) {
      const message = err.response?.data?.message || "Unable to send message";
      toast.error(message);
    }
  };

  const partner =
    activeConversation?.participants?.find(
      (member) => member._id !== user?._id,
    ) || null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
        <form onSubmit={startNewConversation} className="flex gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Start chat with username"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Start chat
          </button>
        </form>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="bg-white rounded-2xl shadow-md p-4 lg:col-span-1">
          <h2 className="font-semibold text-lg mb-4">Conversations</h2>
          <div className="space-y-3">
            {conversations.length === 0 ? (
              <p className="text-gray-500">No conversations yet.</p>
            ) : (
              conversations.map((conversation) => {
                const otherUser = conversation.participants.find(
                  (member) => member._id !== user?._id,
                );
                return (
                  <button
                    key={conversation._id}
                    onClick={() => openConversation(conversation._id)}
                    className={`w-full text-left p-3 rounded-xl border ${
                      activeConversation?._id === conversation._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="font-medium text-gray-800">
                      {otherUser?.fullName || "User"}
                    </div>
                    <div className="text-xs text-gray-500">
                      @{otherUser?.username || "unknown"}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {conversation.lastMessage}
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="bg-white rounded-2xl shadow-md p-4 lg:col-span-2 min-h-[500px] flex flex-col">
          {loading && (
            <div className="text-center py-8 text-gray-600">Loading...</div>
          )}

          {!loading && activeConversation && (
            <>
              <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {partner
                    ? `${partner.fullName} (@${partner.username})`
                    : "Conversation"}
                </h2>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <p className="text-gray-500">No messages yet. Say hello!</p>
                ) : (
                  messages.map((message) => {
                    const isMine = message.sender?._id === user?._id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${
                            isMine
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p>{message.text}</p>
                          <div
                            className={`text-[10px] mt-1 ${isMine ? "text-blue-100" : "text-gray-500"}`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </form>
            </>
          )}

          {!loading && !activeConversation && !conversations.length && (
            <div className="text-gray-500 text-center py-12">
              Select or start a conversation.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Chat;
