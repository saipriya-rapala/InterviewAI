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
        if (canConnectToPostgres(pgUrl, pgUsername, pgPassword)) {
            log.info("Successfully connected to PostgreSQL at {}", pgUrl);
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(pgUrl);
            config.setUsername(pgUsername);
            config.setPassword(pgPassword);
            config.setDriverClassName("org.postgresql.Driver");
            config.setMaximumPoolSize(10);
            return new HikariDataSource(config);
        }

        log.warn("=========================================================================================");
        log.warn("POSTGRESQL UNAVAILABLE: Unable to connect to {} with user '{}'.", pgUrl, pgUsername);
        log.warn("Falling back to local persistent storage at './data/interviewai'.");
        log.warn("To use PostgreSQL, set DB_PASSWORD in 'backend/.env' (or $env:DB_PASSWORD) and restart.");
        log.warn("=========================================================================================");

        HikariConfig h2Config = new HikariConfig();
        h2Config.setJdbcUrl("jdbc:h2:file:./data/interviewai;MODE=PostgreSQL;AUTO_SERVER=TRUE");
        h2Config.setDriverClassName("org.h2.Driver");
        h2Config.setUsername("sa");
        h2Config.setPassword("");
        h2Config.setMaximumPoolSize(10);
        return new HikariDataSource(h2Config);
    }

    private boolean canConnectToPostgres(String url, String username, String password) {
        if (password == null || password.isBlank()) {
            log.warn("No DB_PASSWORD provided. PostgreSQL connection skipped.");
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
