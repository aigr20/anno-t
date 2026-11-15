package se.aigr20.anno.game.application;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import se.aigr20.anno.domain.Game;

public interface GameRegistry {
  /**
   * Find the game with the external id. If it does not exist an exception is thrown.
   *
   * @param externalId The external id of the game to find.
   * @return The found game.
   * @throws NoGameWithIdException In case no game with that id is found.
   */
  Game requireGameWithExternalId(UUID externalId);

  Optional<Game> findGameOnDate(final OffsetDateTime date);
}
