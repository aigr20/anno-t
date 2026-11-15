package se.aigr20.anno.leaderboard.infrastructure.rest;

import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import se.aigr20.anno.domain.LeaderboardEntry;
import se.aigr20.anno.generated.api.LeaderboardApi;
import se.aigr20.anno.generated.model.GameResult;
import se.aigr20.anno.generated.model.Leaderboard;
import se.aigr20.anno.generated.model.LeaderboardRecord;
import se.aigr20.anno.leaderboard.LeaderboardDomainService;
import se.aigr20.anno.leaderboard.NewLeaderboardRecord;
import se.aigr20.anno.leaderboard.infrastructure.rest.mapping.LeaderboardMapper;

public class LeaderboardResource implements LeaderboardApi {
  private final LeaderboardDomainService leaderboardDomainService;
  private final LeaderboardMapper leaderboardMapper;

  @Inject
  LeaderboardResource(final LeaderboardDomainService leaderboardDomainService,
                      final LeaderboardMapper leaderboardMapper) {
    this.leaderboardDomainService = leaderboardDomainService;
    this.leaderboardMapper = leaderboardMapper;
  }

  @Override
  public Response getLeaderboard(final LocalDate date) {
    final List<LeaderboardEntry> leaderboardEntries = leaderboardDomainService
            .findLeaderboardOnDate(date != null ? date : LocalDate.now(ZONE_SWEDEN));
    final List<LeaderboardRecord> records = leaderboardEntries
            .stream()
            .map(leaderboardMapper::toDto)
            .toList();

    final Leaderboard leaderboard = new Leaderboard().records(records);
    return Response.ok().entity(leaderboard).build();
  }

  @Override
  public Response submitGameResult(final UUID gameId, final GameResult gameResult) {
    final NewLeaderboardRecord newRecord = new NewLeaderboardRecord(gameId,
                                                                    gameResult.getPlayerAlias(),
                                                                    gameResult.getTotalScore(),
                                                                    gameResult
                                                                            .getScoreByQuestion());
    leaderboardDomainService.recordResult(newRecord);
    return Response.noContent().build();
  }
}
