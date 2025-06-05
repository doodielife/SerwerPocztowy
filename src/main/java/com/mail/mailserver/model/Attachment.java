package com.mail.mailserver.model;

import jakarta.persistence.*;

@Entity
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    @Lob
    private byte[] data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id")
    private Message message;

    public Attachment() {}

    public Attachment(String filename, String filepath, Message message) {
        this.filename = filename;
        this.message = message;
    }

    // gettery i settery

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public Message getMessage() { return message; }
    public void setMessage(Message message) { this.message = message; }

    public byte[] getData(){return data;}
    public void setData(byte[] data){this.data = data;}
}
