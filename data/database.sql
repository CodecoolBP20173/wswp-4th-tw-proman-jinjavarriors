CREATE TABLE boards (
    id  SERIAL UNIQUE PRIMARY KEY  NOT NULL,
    title   VARCHAR(200)   NOT NULL,
    is_active     BOOLEAN   NOT NULL,
    user_id     INTEGER     NOT NULL,
    creation_time  TIMESTAMP DEFAULT current_timestamp AT TIME ZONE 'CET',
    modified_time  TIMESTAMP DEFAULT current_timestamp AT TIME ZONE 'CET'
);


CREATE TABLE cards (
    id   SERIAL UNIQUE PRIMARY KEY  NOT NULL,
    title   VARCHAR(200)    NOT NULL,
    board_id    INTEGER     NOT NULL,
    status_id   INTEGER     NOT NULL,
    "order"   INTEGER     NOT NULL,
    user_id     INTEGER     NOT NULL,
    creation_time   TIMESTAMP DEFAULT current_timestamp AT TIME ZONE 'CET',
    modified_time   TIMESTAMP DEFAULT current_timestamp AT TIME ZONE 'CET'
);


CREATE TABLE statuses (
    id  SERIAL UNIQUE PRIMARY KEY  NOT NULL,
    name      VARCHAR(200)  NOT NULL
);


CREATE TABLE users (
    id  SERIAL UNIQUE PRIMARY KEY  NOT NULL,
    user_name   VARCHAR(20)     NOT NULL,
    password    VARCHAR(100)    NOT NULL
);


ALTER TABLE ONLY boards
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);


ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_boards_id FOREIGN KEY (board_id) REFERENCES boards(id),
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES statuses(id),
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);


INSERT INTO statuses (name)
    VALUES ('New');
INSERT INTO statuses (name)
    VALUES ('In progress');
INSERT INTO statuses (name)
    VALUES ('Testing');
INSERT INTO statuses (name)
    VALUES ('Done');

