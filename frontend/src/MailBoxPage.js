import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MailBoxPage.css";

export default function MailboxPage({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [activeFolder, setActiveFolder] = useState("inbox");

  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();

  useEffect(() => {
    let endpoint = "";
    if (activeFolder === "inbox") {
      endpoint = `http://localhost:8081/api/messages/inbox?recipientEmail=${userEmail}`;
    } else if (activeFolder === "sent") {
      endpoint = `http://localhost:8081/api/messages/sent?senderEmail=${userEmail}`;
    }

    if (endpoint) {
      fetch(endpoint)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error("Błąd przy pobieraniu wiadomości:", err));
    }
  }, [activeFolder, userEmail]);

  const handleComposeClick = () => {
    navigate("/sendmessage");
  };

  return (
    <div className="mailbox-container">
      <div className="sidebar">
        <h3>Menu</h3>
        <ul>
          <li>
            <button onClick={() => setActiveFolder("inbox")}>📥 Odebrane</button>
          </li>
          <li>
            <button onClick={() => setActiveFolder("sent")}>📤 Wysłane</button>
          </li>
          <li>
            <button onClick={() => setActiveFolder("trash")}>🗑️ Kosz</button>
          </li>
        </ul>

        <button className="create-button" onClick={handleComposeClick}>Napisz</button>
        <button className="logout-button" onClick={onLogout}>Wyloguj</button>
      </div>

      <div className="message-list">
        <h2>{activeFolder === "inbox" ? "Odebrane wiadomości" : "Wysłane wiadomości"}</h2>
        <table>
          <thead>
            <tr>
              <th>{activeFolder === "inbox" ? "Od" : "Do"}</th>
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
              messages.map((msg) => (
                <tr
                  key={msg.id}
                  onClick={() => navigate(`/mailbox/message/${msg.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{activeFolder === "inbox" ? msg.senderEmail : msg.recipientEmail}</td>
                  <td>{msg.subject}</td>
                  <td>{new Date(msg.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
