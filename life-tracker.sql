\echo 'Delete and recreate life_tracker db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE life_tracker;
CREATE DATABASE life_tracker;
\connect life_tracker

\i life-tracker-schema.sql

\echo 'Delete and recreate life_tracker_test db?'
\prompt 'Return for yes or control-C to cancel > ' answer

DROP DATABASE life_tracker_test;
CREATE DATABASE life_tracker_test;
\connect life_tracker_test

\i life-tracker-schema.sql
