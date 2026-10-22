package se.aigr20.anno.game.application;

import java.util.List;

import se.aigr20.anno.domain.Question;

public interface QuestionsForGameProvider {
  List<Question> getQuestionsForNextGame(int limit);
}
