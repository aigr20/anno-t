package se.aigr20.anno.question.infrastructure.db;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import se.aigr20.anno.domain.Question;

@ApplicationScoped
public class QuestionRepository {
  private final EntityManager entityManager;

  @Inject
  public QuestionRepository(final EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  public void save(final Question question) {
    entityManager.persist(question);
  }
}
