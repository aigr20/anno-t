package se.aigr20.anno.game;

import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.game.application.GameRegistry;
import se.aigr20.anno.game.error.NoActiveGameException;
import se.aigr20.anno.game.error.NoGameWithIdFoundException;
import se.aigr20.anno.game.infrastructure.db.GameRepository;

@ApplicationScoped
public class GameDomainService implements GameRegistry {
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

  @Override
  public Game requireGameWithExternalId(UUID externalId) {
    return gameRepository
            .findGameByExternalId(externalId)
            .orElseThrow(() -> new NoGameWithIdFoundException(externalId));
  }
}
