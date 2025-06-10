package com.mail.mailserver.service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class AESUtil {

    private static final String ALGORITHM = "AES";

    // Klucz musi mieć 16 bajtów (128 bitów)
    private static final byte[] KEY = "MySuperSecretKey".getBytes();

    public static String encrypt(String value) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(KEY, ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] encrypted = cipher.doFinal(value.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas szyfrowania", e);
        }
    }

    public static String decrypt(String encryptedValue) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(KEY, ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] decoded = Base64.getDecoder().decode(encryptedValue);
            byte[] original = cipher.doFinal(decoded);
            return new String(original, "UTF-8");
        } catch (Exception e) {
            throw new RuntimeException("Błąd podczas odszyfrowywania", e);
        }
    }
}
