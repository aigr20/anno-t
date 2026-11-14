package se.aigr20.anno.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(schema = "anno", name = "leaderboard_question_entries")
public class LeaderboardQuestionEntry {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE,
                  generator = "pk_leaderboard_question_entry_seq")
  @SequenceGenerator(name = "pk_leaderboard_question_entry_seq",
                     schema = "anno",
                     allocationSize = 1,
                     sequenceName = "leaderboard_question_entries_id_seq")
  @Column(name = "id", nullable = false) private Long id;

  @Column(name = "score", nullable = false) private int score;

  @Column(name = "\"order\"", nullable = false) private int order;

  public LeaderboardQuestionEntry(final int score, final int index) {
    this.score = score;
    this.order = index;
  }

  protected LeaderboardQuestionEntry() {
  }

  public Long getId() {
    return id;
  }

  public int getScore() {
    return score;
  }

  public int getOrder() {
    return order;
  }
}
