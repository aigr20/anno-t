package se.aigr20.anno.game.infrastructure.rest;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import se.aigr20.anno.common.exception.rest.DetailedErrorExceptionMapper;
import se.aigr20.anno.common.exception.rest.ErrorBody;
import se.aigr20.anno.game.error.NoGameWithIdFoundException;
import se.aigr20.anno.generated.model.DetailedError;
import se.aigr20.anno.generated.model.DetailedError.TypeEnum;

@Provider
public class NoGameWithIdFoundExceptionMapper extends DetailedErrorExceptionMapper<NoGameWithIdFoundException, DetailedError> {
  @Override
  protected int getStatusCode() {
    return Response.Status.NOT_FOUND.getStatusCode();
  }

  @Override
  protected TypeEnum getType() {
    return TypeEnum.MISSING_GAME;
  }

  @Override
  protected ErrorBody toErrorBody(final NoGameWithIdFoundException exception) {
    return new ErrorBody(Response.Status.NOT_FOUND.getReasonPhrase(), exception.getMessage());
  }
}
