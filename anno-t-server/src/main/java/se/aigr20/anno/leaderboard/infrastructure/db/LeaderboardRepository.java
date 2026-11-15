package se.aigr20.anno.leaderboard.infrastructure.db;

import java.util.List;
import java.util.UUID;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.transaction.Transactional.TxType;

import se.aigr20.anno.domain.LeaderboardEntry;

@ApplicationScoped
public class LeaderboardRepository {
  private final EntityManager entityManager;

  @Inject
  LeaderboardRepository(final EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  @Transactional(TxType.REQUIRED)
  public void persist(final LeaderboardEntry leaderboardEntry) {
    entityManager.persist(leaderboardEntry);
  }

  public List<LeaderboardEntry> getLeaderboardForGameId(final UUID gameId) {
    return entityManager
            .createQuery("from LeaderboardEntry leaderboard where leaderboard.gameId = :gameId",
                         LeaderboardEntry.class)
            .setParameter("gameId", gameId)
            .getResultList();
  }
}
