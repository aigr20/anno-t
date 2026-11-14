package se.aigr20.anno.leaderboard;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.domain.LeaderboardEntry;
import se.aigr20.anno.domain.LeaderboardQuestionEntry;
import se.aigr20.anno.game.application.GameRegistry;
import se.aigr20.anno.leaderboard.infrastructure.db.LeaderboardRepository;

@ApplicationScoped
public class LeaderboardDomainService {
  private final GameRegistry gameRegistry;
  private final LeaderboardRepository leaderboardRepository;

  @Inject
  LeaderboardDomainService(final GameRegistry gameRegistry,
                           final LeaderboardRepository leaderboardRepository) {
    this.gameRegistry = gameRegistry;
    this.leaderboardRepository = leaderboardRepository;
  }

  public void recordResult(final NewLeaderboardRecord newRecord) {
    final Game game = gameRegistry.requireGameWithExternalId(newRecord.gameId());
    final LeaderboardEntry entry = new LeaderboardEntry(newRecord.playerAlias(),
                                                        game.getExternalId());

    for (int i = 0; i < newRecord.scoreByQuestion().size(); i++) {
      final Integer score = newRecord.scoreByQuestion().get(i);
      final LeaderboardQuestionEntry questionEntry = new LeaderboardQuestionEntry(score, i);
      entry.addQuestionEntry(questionEntry);
    }

    leaderboardRepository.persist(entry);
  }
}
