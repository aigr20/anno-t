package se.aigr20.anno.game;

import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.domain.Question;
import se.aigr20.anno.game.application.QuestionsForGameProvider;
import se.aigr20.anno.game.infrastructure.db.GameRepository;

@ApplicationScoped
public class GameCreator {
  private final GameRepository gameRepository;
  private final QuestionsForGameProvider questionProvider;

  @Inject
  GameCreator(final GameRepository gameRepository,
              final QuestionsForGameProvider questionProvider) {
    this.gameRepository = gameRepository;
    this.questionProvider = questionProvider;
  }

  @Transactional
  public Game ensureGameExists(final OffsetDateTime atDate) {
    final Optional<Game> existingGame = gameRepository.findActiveGameAtTimestamp(atDate);
    if (existingGame.isPresent()) {
      return existingGame.get();
    }

    final Game newGame = new Game(atDate
            .toLocalDate()
            .atStartOfDay(ZONE_SWEDEN)
            .toOffsetDateTime());
    final List<Question> questions = questionProvider.getQuestionsForNextGame(5);
    if (questions.size() < 5) {
      throw new IllegalStateException("Could not create a new game due to not enough questions. Only received " +
                                      questions.size());
    }

    for (final Question question : questions) {
      newGame.addQuestion(question);
    }

    try {
      gameRepository.persist(newGame);
    } catch (final PersistenceException e) {
      // Someone has probably created the game between our lookup and us creating the game ourselves
      // If not, fail
      return gameRepository
              .findActiveGameAtTimestamp(atDate)
              .orElseThrow(() -> new IllegalStateException("Failed to both create and get active game"));
    }

    return newGame;
  }
}
