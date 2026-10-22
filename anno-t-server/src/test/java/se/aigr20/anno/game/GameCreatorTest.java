package se.aigr20.anno.game;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import se.aigr20.anno.domain.Game;
import se.aigr20.anno.domain.Question;
import se.aigr20.anno.game.application.QuestionsForGameProvider;
import se.aigr20.anno.game.infrastructure.db.GameRepository;

class GameCreatorTest {
  GameCreator sut;

  @Mock GameRepository gameRepository;
  @Mock QuestionsForGameProvider questionProvider;

  List<Question> upcomingQuestions;
  AutoCloseable openedMocks;

  @BeforeEach
  void setUp() {
    openedMocks = MockitoAnnotations.openMocks(this);

    sut = new GameCreator(gameRepository, questionProvider);

    upcomingQuestions = new ArrayList<>();
    when(questionProvider.getQuestionsForNextGame(anyInt())).thenReturn(upcomingQuestions);
  }

  @AfterEach
  void tearDown() throws Exception {
    openedMocks.close();
  }

  @Test
  void when_GameAlreadyExists_then_DoNothing() {
    final OffsetDateTime timestamp = OffsetDateTime.now();
    final Game game = mock(Game.class);
    when(gameRepository.findActiveGameAtTimestamp(timestamp)).thenReturn(Optional.of(game));

    sut.ensureGameExists(timestamp);

    verify(gameRepository).findActiveGameAtTimestamp(timestamp);
    verifyNoInteractions(questionProvider);
    verifyNoMoreInteractions(gameRepository);
  }

  @Test
  void when_NotEnoughQuestionsFound_then_ThrowException() {
    final OffsetDateTime timestamp = OffsetDateTime.now();
    mockNUpcomingQuestions(4);

    assertThatThrownBy(() -> sut.ensureGameExists(timestamp)).isInstanceOf(Exception.class);
  }

  @Test
  void when_EnsureGameExists_then_CreateGameWithQuestions() {
    mockNUpcomingQuestions(5);
    final OffsetDateTime now = OffsetDateTime.now();

    final ArgumentCaptor<Game> gameCaptor = ArgumentCaptor.forClass(Game.class);
    sut.ensureGameExists(now);

    verify(gameRepository).persist(gameCaptor.capture());

    final Game createdGame = gameCaptor.getValue();
    assertThat(createdGame.getQuestions()).hasSize(5).containsExactlyElementsOf(upcomingQuestions);
    assertThat(createdGame.getStartTimestamp())
            .isEqualTo(now
                    .toLocalDate()
                    .atStartOfDay(ZoneId.of("Europe/Stockholm"))
                    .toOffsetDateTime());
    assertThat(createdGame.getEndTimestamp())
            .isEqualTo(now
                    .toLocalDate()
                    .atStartOfDay(ZoneId.of("Europe/Stockholm"))
                    .toOffsetDateTime()
                    .withHour(23)
                    .withMinute(59)
                    .withSecond(59));
    assertThat(createdGame.getExternalId()).isNotNull();
  }

  void mockNUpcomingQuestions(final int count) {
    for (int i = 0; i < count; i++) {
      final Question question = mock(Question.class);
      upcomingQuestions.add(question);
    }
  }
}
