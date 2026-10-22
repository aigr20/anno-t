package se.aigr20.anno.game;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.transaction.Transactional.TxType;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.domain.Question;
import se.aigr20.anno.game.infrastructure.db.GameRepository;

@ApplicationScoped
public class GameCreator {
  private final GameRepository gameRepository;
  private final QuestionsForGameDomainService questionsForGameDomainService;

  @Inject
  GameCreator(final GameRepository gameRepository,
              final QuestionsForGameDomainService questionsForGameDomainService) {
    this.gameRepository = gameRepository;
    this.questionsForGameDomainService = questionsForGameDomainService;
  }

  @Transactional(TxType.REQUIRED)
  public void ensureGameExists(final OffsetDateTime atDate) {
    final Optional<Game> existingGame = gameRepository.findActiveGameAtTimestamp(atDate);
    if (existingGame.isPresent()) {
      return;
    }

    final Game newGame = new Game(atDate
            .toLocalDate()
            .atStartOfDay(ZoneId.of("Europe/Stockholm"))
            .toOffsetDateTime());
    final List<Question> questions = questionsForGameDomainService.getQuestionsForNextGame();
    if (questions.size() < 5) {
      throw new IllegalStateException("Could not create a new game due to not enough questions. Only received " +
                                      questions.size());
    }

    for (final Question question : questions) {
      newGame.addQuestion(question);
    }

    gameRepository.persist(newGame);
  }
}
