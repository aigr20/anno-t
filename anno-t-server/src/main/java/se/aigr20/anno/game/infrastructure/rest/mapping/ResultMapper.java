package se.aigr20.anno.game.infrastructure.rest.mapping;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants.ComponentModel;

import se.aigr20.anno.common.BaseMapper;
import se.aigr20.anno.generated.model.GuessResult;

@Mapper(componentModel = ComponentModel.CDI)
public interface ResultMapper extends BaseMapper {
  @Mapping(source = "distanceFromCorrectAnswer", target = "distanceFromCorrect")
  GuessResult toDto(se.aigr20.anno.domain.GuessResult from);
}
