package se.aigr20.anno.domain;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(schema = "anno", name = "created_games")
public class Game {
  @Id
  @GeneratedValue(generator = "game_pk_seq", strategy = GenerationType.SEQUENCE)
  @SequenceGenerator(schema = "anno",
                     sequenceName = "game_pk_seq",
                     allocationSize = 1,
                     name = "game_pk_seq") private Long id;

  @Column(name = "start_date", nullable = false) private OffsetDateTime startTimestamp;

  @Column(name = "end_date", nullable = false) private OffsetDateTime endTimestamp;

  @Column(name = "ext_id", nullable = false) private UUID externalId;

  @OneToMany(fetch = FetchType.LAZY)
  @JoinColumn(name = "game_id") private List<Question> questions;

  protected Game() {
    questions = new ArrayList<>();
  }

  public Game(final OffsetDateTime start) {
    this.startTimestamp = start;
    this.endTimestamp = start.withHour(23).withMinute(59).withSecond(59);
    this.externalId = UUID.randomUUID();
    this.questions = new ArrayList<>();
  }

  public Long getId() {
    return id;
  }

  public OffsetDateTime getStartTimestamp() {
    return startTimestamp;
  }

  public OffsetDateTime getEndTimestamp() {
    return endTimestamp;
  }

  public UUID getExternalId() {
    return externalId;
  }

  public List<Question> getQuestions() {
    return Collections.unmodifiableList(questions);
  }

  public void addQuestion(final Question question) {
    questions.add(question);
  }
}
