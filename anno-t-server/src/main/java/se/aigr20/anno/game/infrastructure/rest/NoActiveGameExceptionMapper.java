package se.aigr20.anno.game.infrastructure.rest;

import jakarta.ws.rs.core.Response;

import se.aigr20.anno.common.exception.rest.DetailedErrorExceptionMapper;
import se.aigr20.anno.common.exception.rest.ErrorBody;
import se.aigr20.anno.game.error.NoActiveGameException;
import se.aigr20.anno.generated.model.DetailedError;
import se.aigr20.anno.generated.model.DetailedError.TypeEnum;

public class NoActiveGameExceptionMapper extends DetailedErrorExceptionMapper<NoActiveGameException, DetailedError> {
  @Override
  protected int getStatusCode() {
    return Response.Status.NOT_FOUND.getStatusCode();
  }

  @Override
  protected TypeEnum getType() {
    return TypeEnum.MISSING_GAME;
  }

  @Override
  protected ErrorBody toErrorBody(final NoActiveGameException exception) {
    return new ErrorBody(Response.Status.NOT_FOUND.getReasonPhrase(),
                         "There is no active game available");
  }
}
