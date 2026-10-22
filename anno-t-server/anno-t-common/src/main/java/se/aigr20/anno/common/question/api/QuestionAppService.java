package se.aigr20.anno.common.question.api;

import java.util.List;

import se.aigr20.anno.common.domain.Question;

public interface QuestionAppService {
  List<Question> getQuestionsWithNoGameConnected(int limit);
}
