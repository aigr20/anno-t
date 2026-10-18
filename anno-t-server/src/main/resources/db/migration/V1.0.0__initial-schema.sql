create sequence anno.question_pk_seq cache 1;

create table anno.questions (
  id bigint not null,
  question text not null,
  answer integer not null,

  constraint pk_questions primary key (id)
);
