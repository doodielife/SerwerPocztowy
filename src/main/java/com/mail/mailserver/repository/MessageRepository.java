package com.mail.mailserver.repository;

import com.mail.mailserver.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // Wszystkie wiadomości otrzymane przez użytkownika
    List<Message> findByRecipientEmailAndFolderAndRecipientDeletedFalse(String recipientEmail, String folder);

    // Wszystkie wiadomości wysłane przez użytkownika
    List<Message> findBySenderEmailAndSenderDeletedFalse(String senderEmail);

}
