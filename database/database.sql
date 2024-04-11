-- Crear la base de datos si no existe
CREATE DATABASE flick_finder;
\c flick_finder;

-- Crear la tabla de usuario
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    userName TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Crear la tabla de listas
CREATE TABLE "list" (
    id SERIAL PRIMARY KEY,
    id_user INT,
    name TEXT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES "user"(id)
);

-- Crear la tabla de películas
CREATE TABLE movie_x_list (
    id_mxl SERIAL PRIMARY KEY,
    id_movie INT,
    list_id INT,
    FOREIGN KEY (list_id) REFERENCES "list"(id)
);

-- Crear la tabla de relación entre comentarios y usuarios
CREATE TABLE comment_x_user (
    id_cxu SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    user_id INT,
    id_movie INT,
    FOREIGN KEY (user_id) REFERENCES "user"(id)
);
