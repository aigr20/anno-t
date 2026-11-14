package se.aigr20.anno.leaderboard.infrastructure.db;

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
}
