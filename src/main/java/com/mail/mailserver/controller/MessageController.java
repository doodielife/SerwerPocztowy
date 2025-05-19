package com.mail.mailserver.controller;

import com.mail.mailserver.model.Message;
import com.mail.mailserver.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
}
