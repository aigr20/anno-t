package se.aigr20.anno.question.infrastructure.db;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.transaction.Transactional.TxType;

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

  @Transactional(TxType.MANDATORY)
  public List<Question> getQuestionsForNextGame(final int count) {
    final String sql = "from Question question where question.gameId is null order by question.id asc";
    return entityManager.createQuery(sql, Question.class).setMaxResults(count).getResultList();
  }
}
