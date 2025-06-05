package com.mail.mailserver.service;

import com.mail.mailserver.model.Attachment;
import java.util.Optional;

public interface AttachmentService {
    Optional<Attachment> getAttachmentById(Long id);
}
