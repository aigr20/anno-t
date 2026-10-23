package se.aigr20.anno.domain;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mockStatic;
import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.OffsetDateTime;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.MockedStatic;

class QuestionTest {
  Question sut;

  MockedStatic<OffsetDateTime> nowStaticMock;

  @BeforeEach
  void setUp() {
    final OffsetDateTime mockedNow = OffsetDateTime.now().withYear(2026);
    nowStaticMock = mockStatic(OffsetDateTime.class);
    nowStaticMock.when(() -> OffsetDateTime.now(ZONE_SWEDEN)).thenReturn(mockedNow);
  }

  @AfterEach
  void tearDown() {
    nowStaticMock.close();
  }

  static Object[][] testCases() {
    return new Object[][]{{3, 9, new GuessResult(6, 2023, 3, 94)},
                          {-3, 9, new GuessResult(12, 2029, -3, 88)},
                          {-3, -9, new GuessResult(6, 2029, -3, 94)},};
  }

  @ParameterizedTest
  @MethodSource("testCases")
  void when_GuessSubmitted_then_CalculateDistanceFromAnswer(final int correctAnswer,
                                                            final int guess,
                                                            final GuessResult expectedResult) {
    sut = new Question("", correctAnswer);

    final GuessResult result = sut.guessAnswer(new Guess(guess, 0));
    assertThat(result).isEqualTo(expectedResult);
  }
}
