import Migration from '../migration.js';

const migration = new Migration('./database.sqlite');

await migration.up(async (execute) => {
    // Включение внешних ключей
    await execute(`PRAGMA foreign_keys=ON;`);

    // Таблица structure
    await execute(`
        create table if not exists structure (
            id integer primary key autoincrement,
            name text not null,
            address text not null
        );
    `);

    // Таблица floor
    await execute(`
        create table if not exists floor (
            id integer primary key autoincrement,
            name text not null,
            structure_id integer not null,
            foreign key (structure_id) references structure(id) on delete cascade
        );
    `);

    // Таблица room
    await execute(`
        create table if not exists room (
            id integer primary key autoincrement,
            name text not null,
            floor_id integer not null,
            foreign key (floor_id) references floor(id) on delete cascade
        );
    `);

    // Таблица place
    await execute(`
        create table if not exists place (
            id integer primary key autoincrement,
            name text not null,
            room_id integer,
            foreign key (room_id) references room(id) on delete cascade
        );
    `);

    // Таблица location
    await execute(`
        create table if not exists location (
            id integer primary key autoincrement,
            place_id integer not null,
            foreign key (place_id) references place(id) on delete cascade
        );
    `);

    // Таблица category
    await execute(`
        create table if not exists category (
            id integer primary key autoincrement,
            name text not null,
            parent_id integer,
            foreign key (parent_id) references category(id) on delete set null
        );
    `);

    // Таблица item 
    await execute(`
        create table if not exists item (
            id integer primary key autoincrement,
            name text not null,
            category_id integer,
            current_location_id integer,
            expected_location_id integer,
            properties text not null,
            status text not null,
            foreign key (category_id) references category(id) on delete set null,
            foreign key (current_location_id) references location(id) on delete set null,
            foreign key (expected_location_id) references location(id) on delete set null
        );
    `);
});