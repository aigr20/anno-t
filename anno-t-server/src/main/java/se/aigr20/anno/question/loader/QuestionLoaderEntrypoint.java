package se.aigr20.anno.question.loader;

import jakarta.inject.Inject;

import io.quarkus.runtime.QuarkusApplication;

public class QuestionLoaderEntrypoint implements QuarkusApplication {
  private final QuestionLoaderService service;

  @Inject
  QuestionLoaderEntrypoint(final QuestionLoaderService service) {
    this.service = service;
  }

  @Override
  public int run(String... args) throws Exception {
    service.loadQuestionsIntoDatabase();
    return 0;
  }
}
