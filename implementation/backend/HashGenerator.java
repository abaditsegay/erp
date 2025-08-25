import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("secret");
        System.out.println("BCrypt hash for 'secret': " + hash);
        System.out.println("Verification test: " + encoder.matches("secret", hash));
    }
}
