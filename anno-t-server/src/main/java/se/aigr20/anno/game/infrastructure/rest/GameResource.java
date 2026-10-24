package se.aigr20.anno.game.infrastructure.rest;

import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import se.aigr20.anno.domain.GuessResult;
import se.aigr20.anno.game.GameDomainService;
import se.aigr20.anno.game.GameOrchestrator;
import se.aigr20.anno.game.infrastructure.rest.mapping.GameMapper;
import se.aigr20.anno.game.infrastructure.rest.mapping.ResultMapper;
import se.aigr20.anno.generated.api.GameApi;
import se.aigr20.anno.generated.model.Game;
import se.aigr20.anno.generated.model.Guess;

public class GameResource implements GameApi {
  private final GameMapper gameMapper;
  private final ResultMapper resultMapper;
  private final GameDomainService gameDomainService;
  private final GameOrchestrator orchestrator;

  @Inject
  GameResource(final GameDomainService gameDomainService,
               final GameMapper gameMapper,
               final GameOrchestrator orchestrator,
               final ResultMapper resultMapper) {
    this.gameDomainService = gameDomainService;
    this.gameMapper = gameMapper;
    this.orchestrator = orchestrator;
    this.resultMapper = resultMapper;
  }

  @Override
  public Response getCurrentGame() {
    final se.aigr20.anno.domain.Game game = gameDomainService.getCurrentlyActiveGame();
    final Game gameDto = gameMapper.toDto(game);

    return Response.ok().entity(gameDto).build();
  }

  @Override
  public Response makeGuess(final UUID gameId, final Integer index, final Guess guess) {
    final GuessResult result = orchestrator.makeGuess(gameId, index, guess);
    final se.aigr20.anno.generated.model.GuessResult dto = resultMapper.toDto(result);
    return Response.ok().entity(dto).build();
  }

}
