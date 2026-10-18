package se.aigr20.anno;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain
public class AnnoApplication {
  public static void main(final String[] args) {
    Quarkus.run(args);
  }
}
