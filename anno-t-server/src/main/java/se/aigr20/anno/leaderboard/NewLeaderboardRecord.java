package se.aigr20.anno.leaderboard;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

public record NewLeaderboardRecord(UUID gameId,
                                   String playerAlias,
                                   int totalScore,
                                   List<Integer> scoreByQuestion) {
  public NewLeaderboardRecord {
    Objects.requireNonNull(gameId);
    Objects.requireNonNull(playerAlias);
    Objects.requireNonNull(scoreByQuestion);
  }
}
