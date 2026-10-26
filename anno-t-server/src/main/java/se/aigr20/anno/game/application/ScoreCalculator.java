package se.aigr20.anno.game.application;

@FunctionalInterface
public interface ScoreCalculator {
  int calculate(int guess, int correct);
}
