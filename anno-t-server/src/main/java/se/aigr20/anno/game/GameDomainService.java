package se.aigr20.anno.game;

import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.OffsetDateTime;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.game.infrastructure.db.GameRepository;

@ApplicationScoped
public class GameDomainService {
  private final GameRepository gameRepository;

  GameDomainService(final GameRepository gameRepository) {
    this.gameRepository = gameRepository;
  }

  public Optional<Game> findCurrentlyActiveGame() {
    final OffsetDateTime now = OffsetDateTime.now(ZONE_SWEDEN);
    return gameRepository.findActiveGameAtTimestamp(now);
  }
}
