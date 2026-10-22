package se.aigr20.anno.common.question.infrastructure.app;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import se.aigr20.anno.common.domain.Question;
import se.aigr20.anno.common.question.api.QuestionAppService;
import se.aigr20.anno.common.question.infrastructure.db.QuestionRepository;

@ApplicationScoped
public class QuestionAppServiceImpl implements QuestionAppService {
  private final QuestionRepository questionRepository;

  @Inject
  QuestionAppServiceImpl(final QuestionRepository questionRepository) {
    this.questionRepository = questionRepository;
  }

  @Override
  public List<Question> getQuestionsWithNoGameConnected(int limit) {
    return questionRepository.getQuestionsForNextGame(limit);
  }
}
