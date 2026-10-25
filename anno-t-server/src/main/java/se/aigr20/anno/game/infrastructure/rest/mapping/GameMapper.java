package se.aigr20.anno.game.infrastructure.rest.mapping;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants.ComponentModel;

import se.aigr20.anno.common.BaseMapper;
import se.aigr20.anno.domain.Game;

@Mapper(componentModel = ComponentModel.CDI)
public interface GameMapper extends BaseMapper {
  @Mapping(source = "externalId", target = "id")
  @Mapping(source = "startTimestamp", target = "begins")
  @Mapping(source = "endTimestamp", target = "expires")
  se.aigr20.anno.generated.model.Game toDto(Game game);
}
