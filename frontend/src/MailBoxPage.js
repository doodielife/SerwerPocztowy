import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MailBoxPage.css";

export default function MailboxPage({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();
  const location = useLocation();

  // Tu uwzględniamy dokładnie to, co powiedziałeś
  const folder = location.pathname === "/mailbox/sent" ? "sent" : location.pathname === "/mailbox/inbox" ? "inbox" : "trash";

  useEffect(() => {
    const endpoint =
      folder === "sent"
        ? `http://localhost:8081/api/messages/sent?senderEmail=${userEmail}`
        :
        folder === "inbox"
        ?
        `http://localhost:8081/api/messages/inbox?recipientEmail=${userEmail}`
        :
        `http://localhost:8081/api/messages/trash?recipientEmail=${userEmail}`;

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Błąd przy pobieraniu wiadomości:", err));
  }, [folder, userEmail]);

  const handleRowClick = (msg) => {
    navigate(`/mailbox/message/${folder}/${msg.id}`);
  };

  const handleComposeClick = () => {
    navigate("/sendmessage");
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
        <h2>{folder === "sent" ? "Wysłane wiadomości" : folder === "inbox" ? "Odebrane wiadomości" : "Kosz"}</h2>
        <table>
          <thead>
            <tr>
              <th>{folder === "sent" ? "Do" : "Od"}</th>
              <th>Temat</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan="3">Brak wiadomości.</td>
              </tr>
            ) : (
              messages.map((msg) => {
                const isUnread = String(msg.read).toLowerCase() === "false";
                console.log(isUnread);
                return (
                  <tr
                    key={msg.id}
                    onClick={() => handleRowClick(msg)}
                    style={{ cursor: "pointer", fontWeight: isUnread ? "bold" : "normal" }}
                  >
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
