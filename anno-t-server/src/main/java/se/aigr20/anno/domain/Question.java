package se.aigr20.anno.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(schema = "anno", name = "questions")
public class Question {
  @Id
  @GeneratedValue(generator = "question_pk_seq", strategy = GenerationType.SEQUENCE)
  @SequenceGenerator(sequenceName = "question_pk_seq",
                     schema = "anno",
                     allocationSize = 1,
                     name = "question_pk_seq") private Long id;

  @Column(name = "question", nullable = false) private String question;

  @Column(name = "answer", nullable = false) private int correctAnswer;

  @Column(name = "game_id") private Long gameId;

  protected Question() {
  }

  public Question(final String question, final int answer) {
    this.question = question;
    this.correctAnswer = answer;
  }

  public Long getId() {
    return id;
  }

  public String getQuestion() {
    return question;
  }

  public int getCorrectAnswer() {
    return correctAnswer;
  }
}
