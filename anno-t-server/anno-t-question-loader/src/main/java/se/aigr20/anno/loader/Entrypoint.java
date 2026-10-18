package se.aigr20.anno.loader;

import java.nio.file.Path;

public class Entrypoint {
  public static void main(final String[] args) throws Exception {
    if (args.length != 1) {
      System.err.println("Invalid parameter count. Accepts one parameter, which is the configuration file.");
    }

    final QuestionLoaderApplication application = new QuestionLoaderApplication();
    application.loadConfiguration(Path.of(args[0]));

    application.loadQuestionsIntoDatabase();
  }
}
