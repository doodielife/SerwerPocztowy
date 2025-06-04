import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./MailBoxPage.css";


export default function ReadMessagePage({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const currentFolder = location.pathname.includes("/sent")
    ? "sent"
    : location.pathname.includes("/trash")
    ? "trash"
    : "inbox";

  const handleMoveToTrash = () => {
    fetch(`http://localhost:8081/api/messages/${id}/trash`, {
      method: "PUT",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nie udało się przenieść wiadomości do kosza");
        navigate("/mailbox/inbox"); // wracamy do odebranych
      })
      .catch((err) => console.error("Błąd przy przenoszeniu do kosza:", err));
  };

  const handleDelete = () => {
    const endpoint =
      currentFolder === "sent"
            ? `http://localhost:8081/api/messages/${id}/delete?userType=sender`
            :  `http://localhost:8081/api/messages/${id}/delete?userType=recipient`
    fetch(endpoint, {
      method: "PUT",
    })
     .then((res) => {
           if (res.ok) {
             // jeśli odpowiedź jest OK (status 200-299)
             console.log('Message deleted successfully');
             navigate("/mailbox/inbox")
             // np. odśwież listę wiadomości, usuń element z UI itp.
           } else {
             // jeśli coś poszło nie tak
             console.error('Failed to delete message');
           }
         })
         .catch((error) => {
           console.error('Error:', error);
         });
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
        console.log("Odebrane dane:", data);
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
          <li><button onClick={() => navigate("/mailbox/inbox")}>📥 Odebrane</button></li>
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
              {currentFolder === "inbox" && (
              <button className="trash-button" onClick={handleMoveToTrash}>🗑️ Przenieś do kosza</button>)}
              {currentFolder === "trash" && (
              <button className="trash-button" onClick={handleMoveToTrash}>↩️ Przywróć wiadomość</button>)}
              <button className="delete-button" onClick={handleDelete}>❌ Usuń wiadomość</button>
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
