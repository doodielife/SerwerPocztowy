import React, { useEffect, useState } from "react";
import "./MailBoxPage.css";

export default function MailboxPage({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [activeFolder, setActiveFolder] = useState("inbox");

  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    if (activeFolder === "inbox" && userEmail) {
      fetch(`http://localhost:8081/api/messages/inbox?recipientEmail=${userEmail}`)
        .then(res => res.json())
        .then(data => setMessages(data))
        .catch(err => console.error("Błąd przy pobieraniu wiadomości:", err));
    }
  }, [activeFolder, userEmail]);

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
        <button className="logout-button" onClick={onLogout}>Wyloguj</button>
      </div>

      <div className="message-list">
        <h2>{activeFolder === "inbox" ? "Odebrane wiadomości" : "Folder: " + activeFolder}</h2>
        <table>
          <thead>
            <tr>
              <th>Od</th>
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
                <tr key={msg.id}>
                  <td>{msg.senderEmail}</td>
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
