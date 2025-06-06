package com.mail.mailserver.service;

import com.mail.mailserver.model.Attachment;
import com.mail.mailserver.repository.AttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    @Autowired
    private AttachmentRepository attachmentRepository;

    @Override
    public Optional<Attachment> getAttachmentById(Long id) {
        return attachmentRepository.findById(id);
    }
}
