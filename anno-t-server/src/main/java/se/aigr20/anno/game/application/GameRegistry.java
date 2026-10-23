package se.aigr20.anno.game.application;

import java.util.Optional;
import java.util.UUID;

import se.aigr20.anno.domain.Game;

public interface GameRegistry {
  Optional<Game> findGameByExternalId(final UUID externalId);
}
