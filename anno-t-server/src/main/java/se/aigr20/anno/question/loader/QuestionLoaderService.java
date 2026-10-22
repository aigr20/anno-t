package se.aigr20.anno.question.loader;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Iterator;
import java.util.Properties;

import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import jakarta.persistence.RollbackException;
import jakarta.transaction.Transactional;

import org.hibernate.exception.ConstraintViolationException;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;

import se.aigr20.anno.domain.Question;
import se.aigr20.anno.question.infrastructure.db.QuestionRepository;
import se.aigr20.anno.question.loader.csv.QuestionCsvBean;

@Dependent
public class QuestionLoaderService {
  private final Properties properties;
  private final QuestionRepository repository;

  @Inject
  QuestionLoaderService(final QuestionRepository repository) {
    this.repository = repository;
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

  @Transactional
  public void loadQuestionsIntoDatabase() throws IOException {
    try (final BufferedReader reader = Files
            .newBufferedReader(Path.of((String) properties.get("csvPath")))) {

      final CSVReader csvReader = new CSVReaderBuilder(reader).build();
      final CsvToBean<QuestionCsvBean> toBean = new CsvToBeanBuilder<QuestionCsvBean>(csvReader)
              .withType(QuestionCsvBean.class)
              .build();

      final Iterator<QuestionCsvBean> it = toBean.iterator();
      try {
        while (it.hasNext()) {
          final QuestionCsvBean bean = it.next();
          final Question entity = new Question(bean.getQuestion(), bean.getAnswer());
          repository.save(entity);
        }
      } catch (final RollbackException e) {
        if (e.getCause() instanceof ConstraintViolationException) {
          System.err
                  .println("Constraint violation detected. Ensure your CSV file contains no questions that already exist. Rolling back the transaction.");
        }
        return;
      }
      return;
    }
  }
}
