package com.mail.mailserver.repository;

import com.mail.mailserver.model.Uzytkownik;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;


public interface UserRepository extends JpaRepository<Uzytkownik,Long>{

    Optional<Uzytkownik> findByEmail(String email);

    // szukanie użytkownika po ID
    Optional<Uzytkownik> findById(Long id);

    // sprawdzanie, czy użytkownik z danym e-mailem już istnieje
    boolean existsByEmail(String email);

    // pobranie wszystkich użytkowników
    List<Uzytkownik> findAll();

}

