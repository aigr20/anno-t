package se.aigr20.anno.leaderboard.infrastructure.rest;

import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import se.aigr20.anno.generated.api.LeaderboardApi;
import se.aigr20.anno.generated.model.GameResult;
import se.aigr20.anno.leaderboard.LeaderboardDomainService;
import se.aigr20.anno.leaderboard.NewLeaderboardRecord;

public class LeaderboardResource implements LeaderboardApi {
  private final LeaderboardDomainService leaderboardDomainService;

  @Inject
  LeaderboardResource(final LeaderboardDomainService leaderboardDomainService) {
    this.leaderboardDomainService = leaderboardDomainService;
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
