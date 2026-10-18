package se.aigr20.anno.loader.csv;

import com.opencsv.bean.CsvBindByName;

public class QuestionCsvBean {
  @CsvBindByName(column = "question", required = true) private String question;
  @CsvBindByName(column = "answer", required = true) private int answer;

  public String getQuestion() {
    return question;
  }

  public int getAnswer() {
    return answer;
  }
}
