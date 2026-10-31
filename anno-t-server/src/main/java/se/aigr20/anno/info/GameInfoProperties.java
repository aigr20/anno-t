package se.aigr20.anno.info;

import io.smallrye.config.ConfigMapping;

@ConfigMapping(prefix = "anno.info")
public interface GameInfoProperties {
  String url();
}
