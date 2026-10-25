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

import io.quarkus.logging.Log;

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
  private final QuestionLoaderConfig config;
  private final QuestionRepository repository;

  @Inject
  QuestionLoaderService(final QuestionLoaderConfig config, final QuestionRepository repository) {
    this.config = config;
    this.repository = repository;
  }

  @Transactional
  public void loadQuestionsIntoDatabase() throws IOException {
    final Path csvPath = config
            .filePath()
            .orElseThrow(() -> new IllegalStateException("No CSV path to load questions from configured"));
    try (final BufferedReader reader = Files.newBufferedReader(csvPath)) {

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
          Log
                  .error("Constraint violation detected. Ensure your CSV file contains no questions that already exist. Rolling back the transaction.");
        }
        return;
      }
      return;
    }
  }
}
