package se.aigr20.anno.game.infrastructure.db;

import java.time.OffsetDateTime;
import java.util.Optional;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;

import se.aigr20.anno.domain.Game;

@ApplicationScoped
public class GameRepository {
  private final EntityManager entityManager;

  @Inject
  GameRepository(final EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  public Optional<Game> findActiveGameAtTimestamp(final OffsetDateTime timestamp) {
    final String sql = "from Game game where :timestamp between game.startTimestamp and game.endTimestamp";
    final Game found = entityManager
            .createQuery(sql, Game.class)
            .setParameter("timestamp", timestamp)
            .getSingleResultOrNull();

    return Optional.ofNullable(found);
  }

  public void persist(final Game game) {
    entityManager.persist(game);
  }

  public void update(final Game game) {
    entityManager.merge(game);
  }
}
