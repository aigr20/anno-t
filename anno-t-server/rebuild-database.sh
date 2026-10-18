#!/bin/bash

password=postgres
default_args="-U postgres -h localhost"

PGPASSWORD=$password psql $default_args --command "select pg_terminate_backend(pid) from pg_stat_activity where pid <> pg_backend_pid() and datname = 'anno_t'"
PGPASSWORD=$password dropdb $default_args --if-exists --echo anno_t
PGPASSWORD=$password createdb $default_args --echo anno_t
