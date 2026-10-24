package se.aigr20.anno.common.exception.rest;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import se.aigr20.anno.generated.model.DetailedError;
import se.aigr20.anno.generated.model.DetailedError.TypeEnum;

@Provider
public class CatchAllExceptionMapper extends DetailedErrorExceptionMapper<Exception, DetailedError> {
  @Override
  protected ErrorBody toErrorBody(Exception exception) {
    return new ErrorBody(Response.Status.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                         exception.getMessage());
  }

  @Override
  protected int getStatusCode() {
    return Response.Status.INTERNAL_SERVER_ERROR.getStatusCode();
  }

  @Override
  protected TypeEnum getType() {
    return TypeEnum.UNKNOWN;
  }
}
