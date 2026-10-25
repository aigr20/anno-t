package se.aigr20.anno.question.loader;

import java.nio.file.Path;
import java.util.Optional;

import io.smallrye.config.ConfigMapping;

@ConfigMapping(prefix = "loader")
public interface QuestionLoaderConfig {
  Optional<Path> filePath();
}
