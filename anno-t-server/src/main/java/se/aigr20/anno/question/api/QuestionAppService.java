package se.aigr20.anno.question.api;

import java.util.List;

import se.aigr20.anno.domain.Question;

public interface QuestionAppService {
  List<Question> getQuestionsWithNoGameConnected(int limit);
}
