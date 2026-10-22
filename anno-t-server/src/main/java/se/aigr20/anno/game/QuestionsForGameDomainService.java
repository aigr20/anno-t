package se.aigr20.anno.game;

import java.util.List;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import se.aigr20.anno.domain.Question;

import se.aigr20.anno.question.api.QuestionAppService;

@ApplicationScoped
public class QuestionsForGameDomainService {
  private final QuestionAppService questionAppService;

  @Inject
  QuestionsForGameDomainService(final QuestionAppService questionAppService) {
    this.questionAppService = questionAppService;
  }

  List<Question> getQuestionsForNextGame() {
    return questionAppService.getQuestionsWithNoGameConnected(5);
  }
}
