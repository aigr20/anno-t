create unique index uq_game_external_id on anno.created_games (ext_id);

create table anno.leaderboard_game_entries (
  id bigserial primary key,
  game_id uuid not null,
  player text not null,

  constraint fk_leaderboard_game foreign key (game_id) references anno.created_games (ext_id)
);

create index ix_leaderboard_game_id on anno.leaderboard_game_entries using btree (game_id);
create index ix_leaderboard_player on anno.leaderboard_game_entries using btree (player);

create table anno.leaderboard_question_entries (
  id bigserial primary key,
  leaderboard_entry_id bigint not null,
  score int not null,
  "order" int not null,

  constraint fk_leaderboard_question_entry foreign key (leaderboard_entry_id) references anno.leaderboard_game_entries (id)
);

create index ix_leaderboard_question_entry on anno.leaderboard_question_entries using btree (leaderboard_entry_id);
