import { useState, useRef, useEffect } from 'react';
import { Icon } from '../components/icons';
import { Card, Button, Input, Modal, Field, Avatar } from '../components/ui';
import DB from '../data';

export default function ChatPage({ role }) {
  const [selected, setSelected] = useState(DB.chats[0] || null);
  const [messages, setMessages] = useState(DB.chatThread);
  const [newMessage, setNewMessage] = useState("");
  const [chats, setChats] = useState(DB.chats);
  const [creating, setCreating] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState([]);
  const [newGroupImage, setNewGroupImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const [attachmentType, setAttachmentType] = useState(null);
  const groupImageInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const optionsMenuRef = useRef(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [activeCall, setActiveCall] = useState(null);
  const [callType, setCallType] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef(null);

  const stickers = [
    // Cristianos y religiosos
    "✝️", "☦️", "🙏", "🕊️", "⛪", "🕯️", "📖", "📕", "📘", "📙",
    "💒", "😇", "👼", "🕍", "🙏", "💪", "👐", "🤲", "🙌", "🤝",
    "❤️", "💛", "💚", "💙", "💜", "🧡", "🤍", "🤎", "💔", "💕",
    "💖", "💗", "💓", "💞", "💘", "💝", "💌", "💟", "✨", "⭐",
    "🌟", "⚡", "🔥", "🕯️", "🌈", "☀️", "🌅", "🌄", "🌆", "🌇",
    "🌃", "🌉", "🌌", "🌠", "🎆", "🎇", "🌠", "✨", "💫", "⭐",
    // Emojis positivos y de fe
    "😇", "😊", "🥰", "😍", "😘", "😗", "😚", "😙", "😄", "😃",
    "😀", "😁", "😆", "😅", "😂", "🤣", "☺️", "🙂", "🙃", "😉",
    "😌", "😍", "🥰", "😘", "😗", "😚", "😙", "🥲", "😋", "😛",
    "😜", "🤪", "😌", "😔", "😑", "😐", "😶", "🤐", "🤨", "🤔",
    // Símbolos religiosos y de esperanza
    "☮️", "☯️", "🕉️", "☸️", "✡️", "☪️", "✝️", "☦️", "☩️", "☬️",
    "🕎", "🔯", "🆘", "✝️", "☪️", "🕋", "⛩️", "🛕", "🕌", "⛪",
    "🏛️", "🕍", "💒", "🔔", "🔕", "🔮", "📿", "⚜️", "🎖️", "🏆",
    "🥇", "🥈", "🥉", "🏅", "👑", "💎", "⚜️", "🎗️", "🎫", "🎟️",
    // Corazones y amor
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
    "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "💌", "💋",
    "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞",
    // Paz y alegría
    "☮️", "🕊️", "🌸", "🌺", "🌻", "🌼", "🌷", "🌹", "🥀", "💐",
    "🌴", "🌲", "🌳", "🌵", "🌾", "🌿", "☘️", "🍀", "🎋", "🎍",
    "⛰️", "🏔️", "🌋", "⛓️", "🗻", "🏕️", "⛺", "🏠", "🏡", "🏘️",
    "🏚️", "🏗️", "🏭", "🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏧",
    "🏨", "🏩", "💒", "🏪", "🏫", "🎓", "⛪", "🕌", "🕍", "🛕",
    "🕋", "⛩️", "🛤️", "🛣️", "🗾", "🎑", "🏞️", "🌅", "🌄", "🌠"
  ];

  const handleSendSticker = (sticker) => {
    const message = {
      from: "You",
      me: true,
      text: sticker,
      isSticker: true,
      status: "sent",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages([...messages, message]);
    setShowStickerPicker(false);
  };

  const handleStartCall = (type) => {
    setActiveCall({
      id: Date.now(),
      contact: selected.name,
      avatar: DB.members.find(m => m.name === selected.name)?.avatar,
      status: "calling",
      type: type
    });
    setCallType(type);
    setCallDuration(0);

    // Simular que la otra persona acepta después de 3 segundos
    setTimeout(() => {
      if (activeCall) {
        setActiveCall(prev => prev ? { ...prev, status: "active" } : null);
        callTimerRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
      }
    }, 3000);
  };

  const handleEndCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    const duration = `${Math.floor(callDuration / 60)}:${(callDuration % 60).toString().padStart(2, '0')}`;

    const message = {
      from: "You",
      me: true,
      text: `${callType === 'video' ? '📹 Videollamada' : '☎️ Llamada'} - Duración: ${duration}`,
      isCall: true,
      status: "sent",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages([...messages, message]);

    setActiveCall(null);
    setCallType(null);
    setCallDuration(0);
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const message = {
      from: "You",
      me: true,
      text: newMessage,
      status: "sent",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || newGroupMembers.length === 0) return;

    const newGroup = {
      id: Math.max(...chats.map(c => c.id)) + 1,
      name: newGroupName,
      last: "Nuevo grupo creado",
      time: "Ahora",
      unread: 0,
      group: true,
      members: newGroupMembers.length,
      groupImage: newGroupImage,
      memberIds: [...newGroupMembers]
    };

    const updatedChats = [newGroup, ...chats];
    setChats(updatedChats);
    setSelected(newGroup);
    setNewGroupName("");
    setNewGroupMembers([]);
    setNewGroupImage(null);
    setCreating(false);
    setMessages([]);
  };

  const handleMemberSelect = (memberId) => {
    setNewGroupMembers(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const message = {
        from: "You",
        me: true,
        text: event.target?.result,
        fileName: file.name,
        fileType: file.type,
        isFile: true,
        status: "sent",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages([...messages, message]);
    };
    reader.readAsDataURL(file);
    fileInputRef.current.value = '';
  };

  const handleAttachmentClick = (type) => {
    setAttachmentType(type);
    fileInputRef.current?.click();
  };

  const handleGroupImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewGroupImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 0, height: "calc(100vh - 180px)", background: "var(--surface)", borderRadius: 0 }}>
      {/* Sidebar */}
      <div style={{ display: "flex", flexDirection: "column", background: "var(--surface)", borderRight: "1px solid var(--border)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid var(--border)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--text)" }}>Chats</h1>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setCreating(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "6px", color: "var(--primary)", fontSize: 18, transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--primary-soft)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
              ➕
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: "12px 16px" }}>
          <div style={{ position: "relative" }}>
            <Icon.Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              style={{
                width: "100%",
                padding: "10px 14px 10px 38px",
                border: "none",
                borderRadius: "8px",
                background: "var(--surface-2)",
                color: "var(--text)",
                fontSize: 13,
                outline: "none"
              }}
              onFocus={e => e.target.style.boxShadow = "0 0 0 2px var(--ring)"}
              onBlur={e => e.target.style.boxShadow = "none"}
            />
          </div>
        </div>

        {/* Chat List */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {filteredChats.map(c => {
            const person = DB.members.find(m => m.name === c.name);
            const isSelected = selected?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: isSelected ? "var(--surface-2)" : "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => !isSelected && (e.currentTarget.style.background = "rgba(128, 128, 128, 0.05)")}
                onMouseLeave={e => !isSelected && (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Avatar name={c.name} size={44} src={person?.avatar} />
                  {person && (
                    <span style={{ position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: "50%", background: "#31a24c", border: "2px solid var(--surface)", boxSizing: "border-box" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {c.time}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.last}
                    </div>
                    {c.unread > 0 && (
                      <span style={{ minWidth: 20, height: 20, padding: "2px 8px", borderRadius: "10px", background: "var(--primary)", color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--surface)" }}>
        {selected ? (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative" }}>
                  <Avatar name={selected.name} size={40} src={DB.members.find(m => m.name === selected.name)?.avatar} />
                  <span style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#31a24c", border: "2px solid var(--surface-2)", boxSizing: "border-box" }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "var(--text)" }}>{selected.name}</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "2px 0 0 0" }}>En línea</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleStartCall('audio')} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "6px", fontSize: 18, color: "var(--text-muted)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--primary-soft)"} onMouseLeave={e => e.currentTarget.style.background = "none"} title="Llamada de voz">
                  ☎️
                </button>
                <button onClick={() => handleStartCall('video')} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "6px", fontSize: 18, color: "var(--text-muted)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--primary-soft)"} onMouseLeave={e => e.currentTarget.style.background = "none"} title="Videollamada">
                  📹
                </button>
                <div style={{ position: "relative" }}>
                  <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", borderRadius: "6px", fontSize: 18, color: "var(--text-muted)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--primary-soft)"} onMouseLeave={e => !showOptionsMenu && (e.currentTarget.style.background = "none")}>
                    ⋮
                  </button>
                  {showOptionsMenu && (
                    <div ref={optionsMenuRef} style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 50, minWidth: 200 }}>
                      <button onClick={() => { setShowOptionsMenu(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "var(--text)", textAlign: "left", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--border)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        📌 Fijar conversación
                      </button>
                      <button onClick={() => { setShowOptionsMenu(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "var(--text)", textAlign: "left", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--border)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        🔕 Silenciar notificaciones
                      </button>
                      <button onClick={() => { setShowOptionsMenu(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "var(--text)", textAlign: "left", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--border)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        🔍 Ver perfil
                      </button>
                      <button onClick={() => { setShowOptionsMenu(false); setSelectedMember(DB.members.find(m => m.name === selected.name)); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "var(--text)", textAlign: "left", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--border)", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        ℹ️ Información
                      </button>
                      <button onClick={() => { setShowOptionsMenu(false); }} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "#d32f2f", textAlign: "left", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        🗑️ Eliminar conversación
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 8, background: "var(--surface)", position: "relative" }}>
              {messages.map((m, i) => {
                const isImage = m.isFile && m.fileType?.startsWith('image/');
                const isVideo = m.isFile && m.fileType?.startsWith('video/');
                return (
                  <div key={i} style={{ display: "flex", justifyContent: m.me ? "flex-end" : "flex-start" }}>
                    {m.isSticker ? (
                      <div style={{ fontSize: 56, padding: "8px" }}>
                        {m.text}
                      </div>
                    ) : (
                      <div style={{
                        maxWidth: "75%",
                        borderRadius: m.me ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        padding: "10px 14px",
                        background: m.me ? "var(--primary)" : "var(--surface-2)",
                        color: m.me ? "#fff" : "var(--text)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        wordWrap: "break-word"
                      }}>
                        {isImage ? (
                          <img src={m.text} alt="Imagen" style={{ maxWidth: "100%", borderRadius: 8, display: "block", marginBottom: 6 }} />
                        ) : isVideo ? (
                          <video controls style={{ maxWidth: "100%", borderRadius: 8, display: "block", marginBottom: 6 }}>
                            <source src={m.text} />
                          </video>
                        ) : m.isFile ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            📄 <span style={{ fontSize: 13 }}>{m.fileName}</span>
                          </div>
                        ) : (
                          <p style={{ fontSize: 14, margin: 0, lineHeight: 1.4, wordBreak: "break-word" }}>{m.text}</p>
                        )}
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, justifyContent: m.me ? "flex-end" : "flex-start" }}>
                          <span style={{ fontSize: 11, opacity: 0.7 }}>{m.time}</span>
                          {m.me && <span style={{ fontSize: 12, opacity: 0.7 }}>✓</span>}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />

              {/* Call Interface */}
              {activeCall && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(13,20,33,0.95)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, zIndex: 40 }}>
                  <div style={{ textAlign: "center" }}>
                    <Avatar name={activeCall.contact} size={100} src={activeCall.avatar} ring />
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "16px 0 8px 0" }}>{activeCall.contact}</h2>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                      {activeCall.status === "calling" ? "Llamando..." : formatCallDuration(callDuration)}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "center", flexWrap: "wrap", maxWidth: 300 }}>
                    {callType === 'video' && (
                      <button style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid #fff", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} title="Cámara">
                        📷
                      </button>
                    )}
                    <button style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid #fff", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} title="Silenciar micrófono">
                      🎤
                    </button>
                    {callType === 'audio' && (
                      <button style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid #fff", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} title="Parlante">
                        🔊
                      </button>
                    )}
                    <button onClick={handleEndCall} style={{ width: 56, height: 56, borderRadius: "50%", background: "#d32f2f", border: "2px solid #d32f2f", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#b71c1c"} onMouseLeave={e => e.currentTarget.style.background = "#d32f2f"} title="Finalizar llamada">
                      ☎️
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} style={{ padding: "12px 16px", background: "var(--surface-2)", borderTop: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ display: "flex", gap: 4, position: "relative" }}>
                <button
                  type="button"
                  onClick={() => handleAttachmentClick('image')}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0, color: "var(--text-muted)", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--primary)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  title="Adjuntar"
                >
                  📎
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachmentClick('gif')}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0, color: "var(--text-muted)", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--primary)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
                  title="GIF"
                >
                  🎬
                </button>
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={() => setShowStickerPicker(!showStickerPicker)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0, color: "var(--text-muted)", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--primary)"}
                    onMouseLeave={e => !showStickerPicker && (e.currentTarget.style.color = "var(--text-muted)")}
                    title="Sticker"
                  >
                    😊
                  </button>
                  {showStickerPicker && (
                    <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 50, padding: "8px", width: "320px", maxHeight: "300px", overflow: "auto", display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "4px" }}>
                      {stickers.map((sticker, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSendSticker(sticker)}
                          style={{ fontSize: 24, background: "transparent", border: "none", cursor: "pointer", padding: "8px", borderRadius: "8px", transition: "all 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >
                          {sticker}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <textarea
                placeholder="Mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage(e)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  fontSize: 14,
                  border: "none",
                  borderRadius: 20,
                  background: "var(--surface)",
                  color: "var(--text)",
                  outline: "none",
                  resize: "none",
                  minHeight: 36,
                  maxHeight: 100,
                  fontFamily: "var(--font-body)"
                }}
              />
              <button
                type="submit"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: 0,
                  color: "var(--primary)",
                  transition: "all 0.2s"
                }}
              >
                ✈️
              </button>
            </form>
            <input ref={fileInputRef} type="file" accept={attachmentType === 'image' ? 'image/*' : attachmentType === 'gif' ? 'image/gif,video/*' : attachmentType === 'sticker' ? 'image/*' : '*'} onChange={handleFileUpload} style={{ display: "none" }} />
          </>
        ) : (
          <div style={{ flex: 1, display: "grid", placeItems: "center", color: "var(--text-muted)" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>💬</div>
              <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Selecciona una conversación</p>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <Modal open={creating} onClose={() => setCreating(false)} title="Nuevo grupo" width={480}
        footer={<><Button variant="outline" onClick={() => setCreating(false)}>Cancelar</Button><Button icon={Icon.Check} onClick={handleCreateGroup} disabled={!newGroupName.trim() || newGroupMembers.length === 0}>Crear</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", flexShrink: 0, background: newGroupImage ? `center/cover url(${newGroupImage})` : "var(--surface-3)", border: "2px solid var(--border)", display: "grid", placeItems: "center", cursor: "pointer" }} onClick={() => groupImageInputRef.current?.click()}>
              {!newGroupImage && <Icon.Image size={24} style={{ color: "var(--text-muted)" }} />}
            </div>
            <div>
              <Button variant="outline" size="sm" icon={Icon.Image} onClick={() => groupImageInputRef.current?.click()}>Foto del grupo</Button>
              <div className="faint" style={{ fontSize: 11, marginTop: 6 }}>JPG o PNG, máx 4 MB</div>
            </div>
            <input ref={groupImageInputRef} type="file" accept="image/jpeg,image/png" onChange={handleGroupImageUpload} style={{ display: "none" }} />
          </div>
          <Field label="Nombre del grupo">
            <Input placeholder="Ej: Equipo de liderazgo" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
          </Field>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", display: "block", marginBottom: 8 }}>Selecciona miembros</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflow: "auto" }}>
              {DB.members.map(member => (
                <label key={member.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: 8, borderRadius: 6, cursor: "pointer", background: "var(--surface-2)" }}>
                  <input type="checkbox" checked={newGroupMembers.includes(member.id)} onChange={() => handleMemberSelect(member.id)} style={{ cursor: "pointer" }} />
                  <Avatar name={member.name} size={32} src={member.avatar} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{member.name}</div>
                    <div className="muted" style={{ fontSize: 11 }}>{member.role}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {selectedMember && (
        <Modal open={!!selectedMember} onClose={() => setSelectedMember(null)} title="Perfil" width={480}
          footer={<><Button variant="outline" onClick={() => setSelectedMember(null)}>Cerrar</Button></>}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 20 }}>
            <Avatar name={selectedMember.name} size={84} src={selectedMember.avatar} ring />
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "14px 0 0 0", color: "var(--text)" }}>{selectedMember.name}</h3>
          </div>
        </Modal>
      )}
    </div>
  );
}
