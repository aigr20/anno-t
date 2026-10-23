package se.aigr20.anno.game.infrastructure.rest;

import java.util.UUID;

import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.core.Response;

import se.aigr20.anno.game.GameDomainService;
import se.aigr20.anno.game.infrastructure.rest.mapping.GameMapper;
import se.aigr20.anno.generated.api.GameApi;
import se.aigr20.anno.generated.model.Game;
import se.aigr20.anno.generated.model.Guess;

public class GameResource implements GameApi {
  private final GameMapper mapper;
  private final GameDomainService gameDomainService;

  @Inject
  GameResource(final GameDomainService gameDomainService, final GameMapper mapper) {
    this.gameDomainService = gameDomainService;
    this.mapper = mapper;
  }

  @Override
  public Response getCurrentGame() {
    final Game game = gameDomainService.findCurrentlyActiveGame().map(mapper::toDto).orElseThrow();

    return Response.ok().entity(game).build();
  }

  @Override
  public Response makeGuess(UUID gameId, Integer index, @Valid Guess guess) {
    return null;
  }

}
