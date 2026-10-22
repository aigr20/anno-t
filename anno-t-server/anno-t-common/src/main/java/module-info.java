module anno.common {
  requires jakarta.persistence;
  requires jakarta.cdi;
  requires jakarta.transaction;

  exports se.aigr20.anno.common.domain;
  exports se.aigr20.anno.common.question.api;
  exports se.aigr20.anno.common.question.infrastructure.db to anno.question.loader;
}
