DROP TABLE IF EXISTS user;
CREATE TABLE user(
    `email` VARCHAR(255) NOT NULL COMMENT '',
    `is_active` bool(1) NOT NULL COMMENT '',
    `is_superuser` bool(1) NOT NULL COMMENT '',
    `full_name` VARCHAR(255) COMMENT '',
    `hashed_password` VARCHAR(2147483647) NOT NULL COMMENT '',
    `id` uuid(2147483647) NOT NULL COMMENT '',
    PRIMARY KEY (id)
) COMMENT = '';