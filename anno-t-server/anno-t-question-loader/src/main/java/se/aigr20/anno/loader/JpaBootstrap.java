package se.aigr20.anno.loader;

import java.util.Map;
import java.util.Properties;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JpaBootstrap {
  private JpaBootstrap() {
  }

  public static EntityManagerFactory createFactory(final Properties configuration) {
    final Map<String, Object> properties = Map
            .of("jakarta.persistence.jdbc.url",
                configuration.get("jdbcUrl"),
                "jakarta.persistence.jdbc.user",
                configuration.get("jdbcUsername"),
                "jakarta.persistence.jdbc.password",
                configuration.get("jdbcPassword"));

    return Persistence.createEntityManagerFactory("question-loader", properties);
  }
}
