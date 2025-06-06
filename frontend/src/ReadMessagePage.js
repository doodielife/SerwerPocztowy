import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./MailBoxPage.css";

export default function ReadMessagePage({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

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
        navigate("/mailbox/inbox");
      })
      .catch((err) => console.error("Błąd przy przenoszeniu do kosza:", err));
  };

  const handleDelete = () => {
    const endpoint =
      currentFolder === "sent"
        ? `http://localhost:8081/api/messages/${id}/delete?userType=sender`
        : `http://localhost:8081/api/messages/${id}/delete?userType=recipient`;
    fetch(endpoint, {
      method: "PUT",
    })
      .then((res) => {
        if (res.ok) {
          console.log("Message deleted successfully");
          navigate("/mailbox/inbox");
        } else {
          console.error("Failed to delete message");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
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

  // Funkcja do ikon plików na podstawie rozszerzenia
  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return "📄";
      case "docx":
      case "doc":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📁";
    }
  };

  return (
    <div className="mailbox-container">
      <div className="sidebar">
        <h3>Menu</h3>
        <ul>
          <li>
            <button onClick={() => navigate("/mailbox/inbox")}>📥 Odebrane</button>
          </li>
          <li>
            <button onClick={() => navigate("/mailbox/sent")}>📤 Wysłane</button>
          </li>
          <li>
            <button onClick={() => navigate("/mailbox/trash")}>🗑️ Kosz</button>
          </li>
        </ul>
        <button className="logout-button" onClick={onLogout}>
          Wyloguj
        </button>
      </div>

      <div className="message-view">
        {loading && <p>Ładowanie wiadomości...</p>}
        {!loading && message && (
          <>
            <div className="top-bar">
              <button className="back-button" onClick={() => navigate(-1)}>
                ⬅️ Powrót
              </button>
              {currentFolder === "inbox" && (
                <button className="trash-button" onClick={handleMoveToTrash}>
                  🗑️ Przenieś do kosza
                </button>
              )}
              {currentFolder === "trash" && (
                <button className="trash-button" onClick={handleMoveToTrash}>
                  ↩️ Przywróć wiadomość
                </button>
              )}
              <button className="delete-button" onClick={handleDelete}>
                ❌ Usuń wiadomość
              </button>
            </div>

            <h2>{message.subject}</h2>
            <p>
              <strong>Od:</strong> {message.senderEmail}
            </p>
            <p>
              <strong>Do:</strong> {message.recipientEmail}
            </p>
            <p>
              <strong>Data:</strong> {new Date(message.timestamp).toLocaleString()}
            </p>
            <hr />
            <div className="message-box">
              <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
            </div>

            {/* Sekcja załączników */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="attachments-section">
                <h3>Załączniki:</h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {message.attachments.map((attachment) => (
                    <li
                      key={attachment.id}
                      style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}
                    >
                      <a
                        href={`http://localhost:8081/api/attachments/${attachment.id}/download`}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={attachment.filename}
                        style={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
                      >
                        {getFileIcon(attachment.filename)} {attachment.filename}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
