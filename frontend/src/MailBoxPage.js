import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MailBoxPage.css";

export default function MailboxPage({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();
  const location = useLocation();

  const folder =
    location.pathname === "/mailbox/sent"
      ? "sent"
      : location.pathname === "/mailbox/inbox"
      ? "inbox"
      : "trash";

  const allSelected = messages.length > 0 && selectedIds.size === messages.length;

  useEffect(() => {
    const endpoint =
      folder === "sent"
        ? `http://localhost:8081/api/messages/sent?senderEmail=${userEmail}`
        : folder === "inbox"
        ? `http://localhost:8081/api/messages/inbox?recipientEmail=${userEmail}`
        : `http://localhost:8081/api/messages/trash?recipientEmail=${userEmail}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setSelectedIds(new Set());
      })
      .catch((err) => console.error("Błąd przy pobieraniu wiadomości:", err));
  }, [folder, userEmail]);

  const handleRowClick = (msg) => {
    navigate(`/mailbox/message/${folder}/${msg.id}`);
  };

  const handleComposeClick = () => {
    navigate("/sendmessage");
  };

  const handleMoveToTrash = async () => {
    const actions = Array.from(selectedIds).map(async (id) => {
      const endpoint =
        folder === "inbox"
          ? `http://localhost:8081/api/messages/${id}/trash`
          : `http://localhost:8081/api/messages/${id}/delete?userType=${folder === "sent" ? "sender" : "recipient"}`;

      try {
        const res = await fetch(endpoint, {
          method: "PUT",
        });

        if (!res.ok) {
          throw new Error(`Nie udało się przetworzyć wiadomości o id ${id}`);
        }
      } catch (err) {
        console.error("Błąd przy przenoszeniu/usuwaniu wiadomości:", err);
      }
    });

    await Promise.all(actions);
    setMessages((prev) => prev.filter((msg) => !selectedIds.has(msg.id)));
    setSelectedIds(new Set());
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(messages.map((msg) => msg.id)));
    }
  };

  const filteredMessages = messages.filter((msg) =>
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mailbox-container">
      <div className="sidebar">
        <h3>Menu</h3>
        <ul>
          <li>
            <button onClick={() => navigate("/mailbox/index")}>📥 Odebrane</button>
          </li>
          <li>
            <button onClick={() => navigate("/mailbox/sent")}>📤 Wysłane</button>
          </li>
          <li>
            <button onClick={() => navigate("/mailbox/trash")}>🗑 Kosz</button>
          </li>
        </ul>

        <button className="create-button" onClick={handleComposeClick}>
          Napisz
        </button>
        <button className="logout-button" onClick={onLogout}>
          Wyloguj
        </button>
      </div>

      <div className="message-list">
        <h2>
          {folder === "sent"
            ? "Wysłane wiadomości"
            : folder === "inbox"
            ? "Odebrane wiadomości"
            : "Kosz"}
        </h2>

          {messages.length > 0 && (
            <div
              className="bulk-action-bar"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    userSelect: "none",
                    fontWeight: 600,
                    color: "#007bff",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#0056b3")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
                >
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    style={{
                      cursor: "pointer",
                      marginRight: "12px",
                      width: "18px",
                      height: "18px",
                      accentColor: "#007bff", // nowoczesny niebieski checkbox (wspierany w nowych przeglądarkach)
                    }}
                  />
                  Zaznacz wszystkie
                </label>
              </div>

              <div style={{ minWidth: "140px", textAlign: "right" }}>
                <button
                  className="delete-button"
                  onClick={handleMoveToTrash}
                  style={{
                    opacity: selectedIds.size > 0 ? 1 : 0,
                    pointerEvents: selectedIds.size > 0 ? "auto" : "none",
                    marginLeft: "20px",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: selectedIds.size > 0 ? "#dc3545" : "transparent",
                    color: selectedIds.size > 0 ? "#fff" : "transparent",
                    transition: "opacity 0.3s ease",
                    cursor: selectedIds.size > 0 ? "pointer" : "default",
                  }}
                >
                  {folder === "inbox" ? "Przenieś do kosza" : "Usuń"}
                </button>
              </div>

             <input
               type="text"
               placeholder="Szukaj wiadomości..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               style={{
                 padding: "10px 20px",
                 borderRadius: "20px",
                 border: "1px solid #007bff", // niebieska ramka na start
                 boxShadow: "0 1px 4px rgba(0, 123, 255, 0.3)", // delikatny niebieski cień
                 outline: "none",
                 transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
               }}
               onFocus={(e) => {
                 e.target.style.borderColor = "#0056b3"; // ciemniejszy niebieski na focus
                 e.target.style.boxShadow = "0 0 8px rgba(0, 86, 179, 0.6)"; // mocniejszy cień niebieski
               }}
               onBlur={(e) => {
                 e.target.style.borderColor = "#007bff"; // powrót do jasnoniebieskiego
                 e.target.style.boxShadow = "0 1px 4px rgba(0, 123, 255, 0.3)"; // delikatny cień
               }}
             />
            </div>
          )}


        <table>
          <thead>
            <tr>
              <th></th>
              <th>{folder === "sent" ? "Do" : "Od"}</th>
              <th>Temat</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan="4">Brak wiadomości.</td>
              </tr>
            ) : (
              filteredMessages.map((msg) => {
                const isUnread = String(msg.read).toLowerCase() === "false";
                return (
                  <tr
                    key={msg.id}
                    onClick={(e) => {
                      if (e.target.type !== "checkbox") {
                        handleRowClick(msg);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      fontWeight: folder === "sent" ? "normal" : isUnread ? "bold" : "normal",
                    }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(msg.id)}
                        onChange={() => toggleSelect(msg.id)}
                      />
                    </td>
                    <td>{folder === "sent" ? msg.recipientEmail : msg.senderEmail}</td>
                    <td>{msg.subject}</td>
                    <td>{new Date(msg.timestamp).toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
