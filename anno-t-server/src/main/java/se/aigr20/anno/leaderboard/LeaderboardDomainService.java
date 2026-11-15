package se.aigr20.anno.leaderboard;

import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

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

  public List<LeaderboardEntry> findLeaderboardOnDate(final LocalDate date) {
    final OffsetDateTime queryDate = date.atStartOfDay(ZONE_SWEDEN).toOffsetDateTime();
    final Optional<Game> game = gameRegistry.findGameOnDate(queryDate);
    if (game.isEmpty()) {
      return List.of();
    }

    final List<LeaderboardEntry> entries = leaderboardRepository
            .getLeaderboardForGameId(game.get().getExternalId());
    entries.sort(Comparator.comparingInt(LeaderboardEntry::getTotalScore).reversed());

    return entries;
  }

  public void recordResult(final NewLeaderboardRecord newRecord) {
    final Game game = gameRegistry.requireGameWithExternalId(newRecord.gameId());
    final LeaderboardEntry entry = new LeaderboardEntry(newRecord.playerAlias(),
                                                        newRecord.totalScore(),
                                                        game.getExternalId());

    for (int i = 0; i < newRecord.scoreByQuestion().size(); i++) {
      final Integer score = newRecord.scoreByQuestion().get(i);
      final LeaderboardQuestionEntry questionEntry = new LeaderboardQuestionEntry(score, i);
      entry.addQuestionEntry(questionEntry);
    }

    leaderboardRepository.persist(entry);
  }
}
