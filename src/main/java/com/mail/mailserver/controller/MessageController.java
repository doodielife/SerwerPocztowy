package com.mail.mailserver.controller;

import com.mail.mailserver.model.Message;
import com.mail.mailserver.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;


import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // Endpoint do wysyłania wiadomości
    @PostMapping("/send")
    public Message sendMessage(@RequestBody Message message) {
        return messageService.sendMessage(message);
    }

    // Pobranie wiadomości dla odbiorcy
    @GetMapping("/inbox")
    public List<Message> getMessagesForRecipient(@RequestParam String recipientEmail) {
        return messageService.getMessagesForRecipient(recipientEmail);
    }

    // Pobranie wiadomości wysłanych przez nadawcę
    @GetMapping("/sent")
    public List<Message> getMessagesFromSender(@RequestParam String senderEmail) {
        return messageService.getMessagesFromSender(senderEmail);
    }

    @GetMapping("/{id}")
    public Message getMessageById(@PathVariable Long id) {
        return messageService.getMessageById(id);
    }

//    // Endpoint do przeniesienia wiadomości do kosza
//    @PutMapping("/{id}/move-to-trash")
//    public ResponseEntity<?> moveMessageToTrash(@PathVariable Long id) {
//        boolean updated = messageService.moveToTrash(id);
//        if (updated) {
//            return ResponseEntity.ok().build();
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

//    @PutMapping("/api/messages/{id}/trash")
//    public ResponseEntity<Void> moveToTrash(@PathVariable Long id) {
//        messageService.moveMessageToTrash(id);
//        return ResponseEntity.ok().build();
//    }

}
