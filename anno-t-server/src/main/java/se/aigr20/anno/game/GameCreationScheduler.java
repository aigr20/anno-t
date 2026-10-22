package se.aigr20.anno.game;

import java.time.OffsetDateTime;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import io.quarkus.scheduler.Scheduled;
import io.quarkus.scheduler.Scheduled.ConcurrentExecution;

@ApplicationScoped
public class GameCreationScheduler {
  private final GameCreator creator;

  @Inject
  GameCreationScheduler(final GameCreator creator) {
    this.creator = creator;
  }

  @Scheduled(cron = "${game-creation.cron}", concurrentExecution = ConcurrentExecution.SKIP)
  void createNextGame() {
    final OffsetDateTime today = OffsetDateTime.now();
    creator.ensureGameExists(today);
    creator.ensureGameExists(today.plusDays(1L));
  }
}
