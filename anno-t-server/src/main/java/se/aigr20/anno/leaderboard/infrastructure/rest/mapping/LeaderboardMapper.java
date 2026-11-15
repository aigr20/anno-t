package se.aigr20.anno.leaderboard.infrastructure.rest.mapping;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants.ComponentModel;

import se.aigr20.anno.common.BaseMapper;
import se.aigr20.anno.domain.LeaderboardEntry;
import se.aigr20.anno.domain.LeaderboardQuestionEntry;
import se.aigr20.anno.generated.model.LeaderboardQuestion;
import se.aigr20.anno.generated.model.LeaderboardRecord;

@Mapper(componentModel = ComponentModel.CDI)
public interface LeaderboardMapper extends BaseMapper {
  @Mapping(source = "totalScore", target = "score")
  @Mapping(source = "questions", target = "scoreByQuestion")
  LeaderboardRecord toDto(LeaderboardEntry leaderboardEntry);

  @Mapping(source = "order", target = "index")
  LeaderboardQuestion toDto(LeaderboardQuestionEntry questionEntry);
}
