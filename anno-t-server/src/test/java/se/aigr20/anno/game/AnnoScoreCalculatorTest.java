package se.aigr20.anno.game;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mockStatic;
import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.Year;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.MockedStatic;

class AnnoScoreCalculatorTest {
  static final Year YEAR = Year.of(2026);

  AnnoScoreCalculator sut;

  MockedStatic<Year> yearStaticMock;

  @BeforeEach
  void setUp() {
    sut = new AnnoScoreCalculator();

    yearStaticMock = mockStatic(Year.class);
    yearStaticMock.when(() -> Year.now(ZONE_SWEDEN)).thenReturn(YEAR);
  }

  @AfterEach
  void tearDown() {
    yearStaticMock.close();
  }

  static Object[][] testCases() {
    return new Object[][]{{5, 5, 100},
                          {-5, -5, 100},
                          {2026, 2026, 100},
                          {100, 50, 94},
                          {-3, 0, 100},
                          {2023, 2026, 90}};
  }

  @ParameterizedTest
  @MethodSource("testCases")
  void when_CalculatingScore_then_CalculateCorrectly(final int guess,
                                                     final int correct,
                                                     final int expectedScore) {
    final int score = sut.calculate(guess, correct);

    assertThat(score).isEqualTo(expectedScore);
  }
}
