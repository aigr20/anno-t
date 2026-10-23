package se.aigr20.anno.game;

import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.domain.GuessResult;
import se.aigr20.anno.game.application.GameRegistry;
import se.aigr20.anno.generated.model.Guess;

@ApplicationScoped
public class GameOrchestrator {
  private final GameRegistry games;

  GameOrchestrator(final GameRegistry games) {
    this.games = games;
  }

  public GuessResult makeGuess(final UUID gameId, final int questionIndex, final Guess guess) {
    final Game game = games.findGameByExternalId(gameId).orElseThrow();

    return game.makeGuess(new se.aigr20.anno.domain.Guess(guess.getYear(), questionIndex));
  }
}
