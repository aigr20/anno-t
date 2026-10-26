package se.aigr20.anno.game;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.domain.GuessResult;
import se.aigr20.anno.game.application.GameRegistry;
import se.aigr20.anno.game.application.ScoreCalculator;
import se.aigr20.anno.game.error.NoGameWithIdFoundException;
import se.aigr20.anno.generated.model.Guess;

@ApplicationScoped
public class GameOrchestrator {
  private final GameRegistry games;
  private final ScoreCalculator scoreCalculator;

  GameOrchestrator(final GameRegistry games, final ScoreCalculator scoreCalculator) {
    this.games = games;
    this.scoreCalculator = scoreCalculator;
  }

  public GuessResult makeGuess(final UUID gameId, final int questionIndex, final Guess guess) {
    final Game game = games
            .findGameByExternalId(gameId)
            .orElseThrow(() -> new NoGameWithIdFoundException(gameId));

    return game
            .makeGuess(new se.aigr20.anno.domain.Guess(guess.getYear(), questionIndex),
                       scoreCalculator);
  }
}
