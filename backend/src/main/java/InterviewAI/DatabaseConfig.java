package InterviewAI;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/interviewai_db}")
    private String pgUrl;

    @Value("${spring.datasource.username:postgres}")
    private String pgUsername;

    @Value("${spring.datasource.password:}")
    private String pgPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String formattedUrl = normalizeJdbcUrl(pgUrl);
        if (canConnectToPostgres(formattedUrl, pgUsername, pgPassword)) {
            log.info("Successfully connected to PostgreSQL at {}", formattedUrl);
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(formattedUrl);
            config.setUsername(pgUsername);
            config.setPassword(pgPassword);
            config.setDriverClassName("org.postgresql.Driver");
            config.setMaximumPoolSize(10);
            return new HikariDataSource(config);
        }

        log.warn("=========================================================================================");
        log.warn("POSTGRESQL UNAVAILABLE: Unable to connect to {} with user '{}'.", formattedUrl, pgUsername);
        log.warn("Falling back to embedded H2 storage.");
        log.warn("=========================================================================================");

        HikariConfig h2Config = new HikariConfig();
        h2Config.setDriverClassName("org.h2.Driver");
        h2Config.setUsername("sa");
        h2Config.setPassword("");
        h2Config.setMaximumPoolSize(10);

        boolean fileStorageReady = false;
        try {
            Files.createDirectories(Paths.get("./data"));
            File testFile = new File("./data/.write-test");
            if (testFile.createNewFile()) {
                testFile.delete();
                fileStorageReady = true;
            }
        } catch (Exception e) {
            log.warn("File storage at ./data not writable ({}); falling back to in-memory DB.", e.getMessage());
        }

        if (fileStorageReady) {
            h2Config.setJdbcUrl("jdbc:h2:file:./data/interviewai;MODE=PostgreSQL;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1");
        } else {
            h2Config.setJdbcUrl("jdbc:h2:mem:interviewaidb;MODE=PostgreSQL;DB_CLOSE_DELAY=-1;DATABASE_TO_UPPER=false");
        }

        return new HikariDataSource(h2Config);
    }

    private String normalizeJdbcUrl(String url) {
        if (url == null) return null;
        String trimmed = url.trim();
        if (trimmed.startsWith("postgres://")) {
            return "jdbc:postgresql://" + trimmed.substring("postgres://".length());
        }
        if (trimmed.startsWith("postgresql://")) {
            return "jdbc:postgresql://" + trimmed.substring("postgresql://".length());
        }
        return trimmed;
    }

    private boolean canConnectToPostgres(String url, String username, String password) {
        if (password == null || password.isBlank()) {
            log.info("No DB_PASSWORD provided. PostgreSQL connection skipped.");
            return false;
        }
        try {
            DriverManager.setLoginTimeout(3);
            try (Connection conn = DriverManager.getConnection(url, username, password)) {
                return true;
            }
        } catch (Exception ex) {
            log.warn("PostgreSQL pre-flight check failed: {}", ex.getMessage());
            return false;
        }
    }
}
