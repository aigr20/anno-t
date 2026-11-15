package se.aigr20.anno.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(schema = "anno", name = "leaderboard_game_entries")
public class LeaderboardEntry {
  @Id
  @Column(name = "id", nullable = false)
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pk_leaderboard_entry_seq")
  @SequenceGenerator(name = "pk_leaderboard_entry_seq",
                     schema = "anno",
                     sequenceName = "leaderboard_game_entries_id_seq",
                     allocationSize = 1) private Long id;

  @Column(name = "player", nullable = false) String player;

  @Column(name = "total_score", nullable = false) int totalScore;

  @Column(name = "game_id", nullable = false) UUID gameId;

  @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST})
  @JoinColumn(name = "leaderboard_entry_id", nullable = false)
  @OrderBy("order ASC") List<LeaderboardQuestionEntry> questions;

  public LeaderboardEntry(final String player, final int totalScore, final UUID gameId) {
    this.player = Objects.requireNonNull(player);
    this.totalScore = totalScore;
    this.gameId = Objects.requireNonNull(gameId);
    this.questions = new ArrayList<>(5);
  }

  protected LeaderboardEntry() {
    this.questions = new ArrayList<>(5);
  }

  public Long getId() {
    return id;
  }

  public String getPlayer() {
    return player;
  }

  public int getTotalScore() {
    return totalScore;
  }

  public UUID getGameId() {
    return gameId;
  }

  public List<LeaderboardQuestionEntry> getQuestions() {
    return Collections.unmodifiableList(questions);
  }

  public void addQuestionEntry(final LeaderboardQuestionEntry entry) {
    questions.add(entry);
  }
}
