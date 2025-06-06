package com.mail.mailserver.controller;

import com.mail.mailserver.model.Attachment;
import com.mail.mailserver.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadAttachment(@PathVariable Long id) {
        Optional<Attachment> attachmentOpt = attachmentService.getAttachmentById(id);

        if (attachmentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Attachment attachment = attachmentOpt.get();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFilename() + "\"")
                .body(attachment.getData());
    }
}
