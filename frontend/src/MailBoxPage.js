import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MailBoxPage.css";

export default function MailboxPage({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
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
          <div className="bulk-action-bar">
            <label>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
              <span style={{ marginLeft: "8px" }}>Zaznacz wszystkie</span>
            </label>

            {selectedIds.size > 0 && (
              <button
                className="delete-button"
                onClick={handleMoveToTrash}
                style={{ marginLeft: "20px" }}
              >
                {folder === "inbox" ? "Przenieś do kosza" : "Usuń"}
              </button>
            )}
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
              messages.map((msg) => {
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
                      fontWeight: isUnread ? "bold" : "normal",
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
