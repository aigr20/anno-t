package se.aigr20.anno.common;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public interface BaseMapper {
  default OffsetDateTime toUtcOffsetDateTime(final OffsetDateTime from) {
    if (from == null) {
      return null;
    }
    return from.withOffsetSameInstant(ZoneOffset.UTC);
  }
}
