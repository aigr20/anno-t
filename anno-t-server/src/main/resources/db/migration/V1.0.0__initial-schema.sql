create sequence anno.game_pk_seq cache 1;

create table anno.created_games (
  id bigint not null,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  ext_id uuid not null,

  constraint pk_games primary key (id),
  constraint valid_game_dates check (start_date < end_date),
  constraint no_overlapping_game exclude using gist (
    tstzrange(start_date, end_date, '[]') with &&
  )
);

create sequence anno.question_pk_seq cache 1;

create table anno.questions (
  id bigint not null,
  question text not null,
  answer integer not null,
  game_id bigint null,

  constraint pk_questions primary key (id),
  constraint uq_question unique (question),
  constraint fk_question_game foreign key (game_id) references anno.created_games
);
