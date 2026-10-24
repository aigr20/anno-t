package se.aigr20.anno.common.exception.rest;

import java.util.Set;

import jakarta.inject.Inject;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import io.quarkus.logging.Log;

import se.aigr20.anno.generated.model.DetailedError;

public abstract class DetailedErrorExceptionMapper<T extends Throwable, E extends DetailedError> implements ExceptionMapper<T> {
  @Inject Validator validator;

  protected DetailedErrorExceptionMapper() {
    if (!getClass().isAnnotationPresent(Provider.class)) {
      throw new IllegalStateException("Invalid configuration. %s must be annotated with @%s"
              .formatted(getClass().getName(), Provider.class.getName()));
    }
  }

  @Override
  public final Response toResponse(final T exception) {
    Log.error("An unexpected error occurred", exception);

    final ErrorBody body = toErrorBody(exception);
    final E error = newError();
    error.status(getStatusCode()).type(getType()).title(body.title()).detail(body.detail());

    final Set<ConstraintViolation<E>> violations = validator.validate(error);
    if (!violations.isEmpty()) {
      throw new ConstraintViolationException(violations);
    }

    return Response.status(getStatusCode()).entity(error).build();
  }

  protected E newError() {
    return (E) new DetailedError();
  }

  protected abstract int getStatusCode();

  protected abstract ErrorBody toErrorBody(T exception);

  protected abstract DetailedError.TypeEnum getType();
}
