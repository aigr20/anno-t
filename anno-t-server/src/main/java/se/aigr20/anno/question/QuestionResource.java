package se.aigr20.anno.question;

import jakarta.ws.rs.core.Response;

import se.aigr20.anno.generated.api.QuestionApi;
import se.aigr20.anno.generated.model.Question;

public class QuestionResource implements QuestionApi {
  @Override
  public Response getQuestion(final Integer index) {
    final Question question;
    if (index.equals(0)) {
      question = new Question().question("What is the current year?");
    } else if (index.equals(1)) {
      question = new Question().question("What was last year?");
    } else {
      question = new Question().question("No more please");
    }
    return Response.ok().entity(question).build();
  }
}
