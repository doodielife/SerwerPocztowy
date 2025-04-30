package com.mail.mailserver.service;

import com.mail.mailserver.model.Uzytkownik;
import com.mail.mailserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;
import java.util.List;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //Metoda do rejestracji użytkownika
    public Uzytkownik registerUser(Uzytkownik user){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    //Metoda do wyszukiwania użytkownika po mailu
    public Optional<Uzytkownik> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

    //Metoda do logowania użytkownika
    public boolean loginUser(String email, String rawPassword){
        Optional<Uzytkownik> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()){
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            return encoder.matches(rawPassword, userOptional.get().getPassword());
        }
        return false;
    }

    //sprawdzanie, czy użytkownik o danym e-mailu już istnieje
    public boolean userExists(String email) {
        return userRepository.existsByEmail(email);
    }

    //pobranie użytkownika po ID
    public Optional<Uzytkownik> getUserById(Long id) {
        return userRepository.findById(id);
    }

    //pobranie wszystkich użytkowników
    public List<Uzytkownik> getAllUsers() {
        return userRepository.findAll();
    }



}
