module anno.app {
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
  requires org.hibernate.orm.core;
  requires com.opencsv;
}
