package se.aigr20.anno;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.QuarkusApplication;
import io.quarkus.runtime.annotations.QuarkusMain;

import se.aigr20.anno.question.loader.QuestionLoaderEntrypoint;

@QuarkusMain
public class AnnoApplication {
  public static void main(final String[] args) throws Exception {
    if (args.length > 0) {
      Quarkus.run(QuestionLoaderEntrypoint.class, args);
      return;
    }
    Quarkus.run(args);
  }
}
