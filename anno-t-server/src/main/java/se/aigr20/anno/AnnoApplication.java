package se.aigr20.anno;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

import se.aigr20.anno.question.loader.QuestionLoaderEntrypoint;

@QuarkusMain
public class AnnoApplication {
  public static void main(final String[] args) throws Exception {
    if (args.length > 0 && args[0].equals("load-questions")) {
      Quarkus.run(QuestionLoaderEntrypoint.class, args);
      return;
    }
    Quarkus.run(args);
  }
}
