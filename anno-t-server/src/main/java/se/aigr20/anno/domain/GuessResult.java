package se.aigr20.anno.domain;

public record GuessResult(int distanceFromCorrectAnswer,
                          int distanceBetweenCurrentYearAndAnswer,
                          int correctAnswer,
                          int score) {
}
