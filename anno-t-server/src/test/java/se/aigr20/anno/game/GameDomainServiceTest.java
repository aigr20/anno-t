package se.aigr20.anno.game;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;
import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.OffsetDateTime;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.game.infrastructure.db.GameRepository;

class GameDomainServiceTest {
  GameDomainService sut;

  @Mock GameCreator gameCreator;
  @Mock GameRepository repository;
  @Mock Game existingGame;
  @Mock Game newGame;

  MockedStatic<OffsetDateTime> mockedOffsetDateTime;
  OffsetDateTime mockedNow = OffsetDateTime.now();

  AutoCloseable openedMocks;

  @BeforeEach
  void setUp() {
    openedMocks = MockitoAnnotations.openMocks(this);
    mockedOffsetDateTime = mockStatic(OffsetDateTime.class);

    sut = new GameDomainService(repository, gameCreator);

    when(gameCreator.ensureGameExists(mockedNow)).thenReturn(newGame);
    mockedOffsetDateTime.when(() -> OffsetDateTime.now(ZONE_SWEDEN)).thenReturn(mockedNow);
  }

  @AfterEach
  void tearDown() throws Exception {
    openedMocks.close();
    mockedOffsetDateTime.close();
  }

  @Test
  void when_GameFound_then_ReturnGame() {
    when(repository.findActiveGameAtTimestamp(mockedNow)).thenReturn(Optional.of(existingGame));

    final Game game = sut.getCurrentlyActiveGame();

    assertThat(game).isSameAs(existingGame);
  }

  @Test
  void when_NoExistingGame_then_CreateNew() {
    final Game game = sut.getCurrentlyActiveGame();

    assertThat(game).isSameAs(newGame);
  }
}
