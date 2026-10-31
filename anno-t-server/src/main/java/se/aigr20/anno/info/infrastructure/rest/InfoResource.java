package se.aigr20.anno.info.infrastructure.rest;

import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;

import se.aigr20.anno.generated.api.InfoApi;
import se.aigr20.anno.generated.model.ServerInfo;
import se.aigr20.anno.info.GameInfoProperties;

public class InfoResource implements InfoApi {
  private final GameInfoProperties properties;

  @Inject
  InfoResource(final GameInfoProperties properties) {
    this.properties = properties;
  }

  @Override
  public Response getInfo() {
    final ServerInfo infoDto = new ServerInfo().gameUrl(properties.url());
    return Response.ok().entity(infoDto).build();
  }
}
