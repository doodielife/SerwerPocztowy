import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MailBoxPage.css";


export default function ReadMessagePage({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleMoveToTrash = () => {
    fetch(`http://localhost:8081/api/messages/${id}/trash`, {
      method: "PUT",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nie udało się przenieść wiadomości do kosza");
        navigate("/mailbox"); // wracamy do odebranych
      })
      .catch((err) => console.error("Błąd przy przenoszeniu do kosza:", err));
  };


  useEffect(() => {
    fetch(`http://localhost:8081/api/messages/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Nie udało się pobrać wiadomości");
        return res.json();
      })
      .then((data) => {
        setMessage(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd:", err);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="mailbox-container">
      <div className="sidebar">
        <h3>Menu</h3>
        <ul>
          <li><button onClick={() => navigate("/mailbox")}>📥 Odebrane</button></li>
          <li><button onClick={() => navigate("/mailbox/sent")}>📤 Wysłane</button></li>
          <li><button onClick={() => navigate("/mailbox/trash")}>🗑️ Kosz</button></li>
        </ul>
        <button className="logout-button" onClick={onLogout}>Wyloguj</button>
      </div>

      <div className="message-view">
        {loading && <p>Ładowanie wiadomości...</p>}
        {!loading && message && (
          <>
            <div className="top-bar">
              <button className="back-button" onClick={() => navigate(-1)}>⬅️ Powrót</button>
              <button className="delete-button" onClick={handleMoveToTrash}>🗑️ Przenieś do kosza</button>
            </div>
            <h2>{message.subject}</h2>
            <p><strong>Od:</strong> {message.senderEmail}</p>
            <p><strong>Do:</strong> {message.recipientEmail}</p>
            <p><strong>Data:</strong> {new Date(message.timestamp).toLocaleString()}</p>
            <hr />
             <div className="message-box">
            <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
