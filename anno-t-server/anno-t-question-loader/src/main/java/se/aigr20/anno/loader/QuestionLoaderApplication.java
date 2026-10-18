package se.aigr20.anno.loader;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.Properties;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.RollbackException;

import org.hibernate.exception.ConstraintViolationException;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;

import se.aigr20.anno.common.domain.Question;
import se.aigr20.anno.common.question.infrastructure.db.QuestionRepository;
import se.aigr20.anno.loader.csv.QuestionCsvBean;

public class QuestionLoaderApplication {
  private final Properties properties;

  QuestionLoaderApplication() {
    properties = new Properties();
  }

  public void loadConfiguration(final Path propertiesFile) throws IOException {
    properties.load(Files.newInputStream(propertiesFile));

    if (!properties.containsKey("jdbcUrl")) {
      throw new IllegalArgumentException("Missing configuration key: jdbcUrl");
    }

    if (!properties.containsKey("jdbcUsername")) {
      throw new IllegalArgumentException("Missing configuration key: jdbcUsername");
    }

    if (!properties.containsKey("jdbcPassword")) {
      throw new IllegalArgumentException("Missing configuration key: jdbcPassword");
    }
  }

  public void loadQuestionsIntoDatabase() throws IOException {
    final EntityManagerFactory entityManagerFactory = JpaBootstrap.createFactory(properties);
    final EntityManager entityManager = entityManagerFactory.createEntityManager();
    final QuestionRepository repository = new QuestionRepository(entityManager);

    try (final BufferedReader reader = Files
            .newBufferedReader(Path.of((String) properties.get("csvPath")))) {

      final CSVReader csvReader = new CSVReaderBuilder(reader).build();
      final CsvToBean<QuestionCsvBean> toBean = new CsvToBeanBuilder<QuestionCsvBean>(csvReader)
              .withType(QuestionCsvBean.class)
              .build();

      entityManager.getTransaction().begin();

      final Iterator<QuestionCsvBean> it = toBean.iterator();
      try {
        while (it.hasNext()) {
          final QuestionCsvBean bean = it.next();
          final Question entity = new Question(bean.getQuestion(), bean.getAnswer());
          repository.save(entity);
        }
        entityManager.getTransaction().commit();
      } catch (final RollbackException e) {
        if (e.getCause() instanceof ConstraintViolationException) {
          System.err
                  .println("Constraint violation detected. Ensure your CSV file contains no questions that already exist. Rolling back the transaction.");
          entityManager.getTransaction().rollback();
        }
      }
      return;
    } finally {
      entityManager.getTransaction().rollback();
    }
  }
}
