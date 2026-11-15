package se.aigr20.anno.leaderboard;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.domain.LeaderboardEntry;
import se.aigr20.anno.game.application.GameRegistry;
import se.aigr20.anno.leaderboard.infrastructure.db.LeaderboardRepository;

class LeaderboardDomainServiceTest {
  LeaderboardDomainService sut;

  @Mock GameRegistry gameRegistry;
  @Mock LeaderboardRepository leaderboardRepository;

  AutoCloseable openedMocks;

  @BeforeEach
  void setUp() {
    openedMocks = MockitoAnnotations.openMocks(this);

    sut = new LeaderboardDomainService(gameRegistry, leaderboardRepository);
  }

  @AfterEach
  void tearDown() throws Exception {
    openedMocks.close();
  }

  @Test
  void when_GetLeaderboard_then_OrderByScoreDescending() {
    final LocalDate date = LocalDate.now();
    final OffsetDateTime queryDate = date.atStartOfDay(ZONE_SWEDEN).toOffsetDateTime();
    final Game game = new Game(queryDate);
    when(gameRegistry.findGameOnDate(queryDate)).thenReturn(Optional.of(game));
    LeaderboardEntry entry1 = new LeaderboardEntry("1", 100, game.getExternalId());
    LeaderboardEntry entry2 = new LeaderboardEntry("2", 50, game.getExternalId());
    when(leaderboardRepository.getLeaderboardForGameId(game.getExternalId()))
            .thenReturn(new ArrayList<>(List.of(entry2, entry1)));

    final List<LeaderboardEntry> entries = sut.findLeaderboardOnDate(date);

    assertThat(entries).containsExactly(entry1, entry2);
  }

  @Test
  void when_NoGamePlayed_then_ReturnNoEntries() {
    final LocalDate date = LocalDate.now();
    when(gameRegistry.findGameOnDate(any(OffsetDateTime.class))).thenReturn(Optional.empty());

    final List<LeaderboardEntry> entries = sut.findLeaderboardOnDate(date);

    assertThat(entries).isEmpty();
  }
}
