package com.mail.mailserver.service;

import com.mail.mailserver.model.User;
import com.mail.mailserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //Metoda do rejestracji użytkownika
    public User registerUser(User user){
        //Możesz tu dodawać np. hashowanie hasła (np.BCrypt)
        return userRepository.save(user);
    }

    //Metoda do wyszukiwania użytkownika po mailu
    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }

}
