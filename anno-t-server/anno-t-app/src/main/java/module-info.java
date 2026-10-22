module anno.app {
  requires anno.common;
  requires com.fasterxml.jackson.annotation;
  requires io.quarkus.core;
  requires jakarta.inject;
  requires jakarta.cdi;
  requires jakarta.ws.rs;
  requires jakarta.validation;
  requires jakarta.annotation;
  requires jakarta.persistence;
  requires quarkus.scheduler.api;
  requires jakarta.transaction;
}
