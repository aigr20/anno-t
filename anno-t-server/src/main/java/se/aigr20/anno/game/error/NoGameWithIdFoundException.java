package se.aigr20.anno.game.error;

import java.util.UUID;

public class NoGameWithIdFoundException extends RuntimeException {
  private final UUID id;

  public NoGameWithIdFoundException(final UUID notFoundId) {
    this.id = notFoundId;
  }

  @Override
  public String getMessage() {
    return "Failed to find a game with id %s".formatted(id);
  }
}
