package com.mail.mailserver.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // unikalny identyfikator wiadomości

    private String senderEmail;     // kto wysłał wiadomość
    private String recipientEmail;  // kto ją otrzymał

    private String subject;   // temat wiadomości
    private String content;   // treść wiadomości

    private boolean senderDeleted = false;
    private boolean recipientDeleted = false;

    private String folder = "inbox";

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Attachment> attachments = new ArrayList<>();




    private LocalDateTime timestamp;  // czas wysłania

    private boolean isRead;  // czy wiadomość została przeczytana

    // ✅ Konstruktor bezargumentowy (wymagany przez JPA)
    public Message() {}

    // ✅ Konstruktor z polami (przydatny przy tworzeniu wiadomości w kodzie)
    public Message(String senderEmail, String recipientEmail, String subject, String content) {
        this.senderEmail = senderEmail;
        this.recipientEmail = recipientEmail;
        this.subject = subject;
        this.content = content;
        this.timestamp = LocalDateTime.now();
        this.isRead = false; // domyślnie wiadomość jest nieprzeczytana
    }

    // ✅ Gettery i Settery (Spring i JPA ich potrzebują)

    public Long getId() {
        return id;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public boolean isSenderDeleted() {
        return senderDeleted;
    }

    public void setSenderDeleted(boolean senderDeleted) {
        this.senderDeleted = senderDeleted;
    }

    public boolean isRecipientDeleted() {
        return recipientDeleted;
    }

    public void setRecipientDeleted(boolean recipientDeleted) {
        this.recipientDeleted = recipientDeleted;
    }

    public String getFolder(){
        return this.folder;
    }

    public void setFolder(String folder){
        this.folder = folder;
    }

    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }

}
