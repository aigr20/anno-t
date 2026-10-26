package se.aigr20.anno.game;

import static se.aigr20.anno.common.Constants.ZONE_SWEDEN;

import java.time.Year;

import jakarta.enterprise.context.Dependent;

import se.aigr20.anno.game.application.ScoreCalculator;

/**
 * Shamelessly copied score calculation from the original Anno (https://anno-game.netlify.app).
 */
@Dependent
public class AnnoScoreCalculator implements ScoreCalculator {
  @Override
  public int calculate(final int guess, final int correct) {
    final int diff = Math.abs(guess - correct);
    final double tolerance = Math.max(30d, 0.395d * (Year.now(ZONE_SWEDEN).getValue() - correct));

    return (int) Math.round(100 * Math.exp((diff * -1) / tolerance));
  }
}
