package se.aigr20.anno.game;

import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.OffsetDateTime;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.game.error.NoActiveGameException;
import se.aigr20.anno.game.infrastructure.db.GameRepository;

@ApplicationScoped
public class GameDomainService {
  private final GameRepository gameRepository;
  private final GameCreator gameCreator;

  GameDomainService(final GameRepository gameRepository, final GameCreator gameCreator) {
    this.gameRepository = gameRepository;
    this.gameCreator = gameCreator;
  }

  public Game getCurrentlyActiveGame() {
    final OffsetDateTime now = OffsetDateTime.now(ZONE_SWEDEN);
    return gameRepository
            .findActiveGameAtTimestamp(now)
            .or(() -> Optional.of(gameCreator.ensureGameExists(now)))
            .orElseThrow(() -> new NoActiveGameException());
  }
}
