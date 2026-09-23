import sqlite from 'sqlite3';

export default class SqliteLinker {
    /* Создаем объект базы данных */
    constructor(filename) {
        this.filename = filename;
        this.db = null;
    }

    /* Подключаемся к бд */
    async connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite.Database(this.filename, (err) => {
                if (err) {
                    console.error('Connection error:', err);
                    reject(err);
                    return;
                }
                console.log(`Database connected: ${this.filename}`);
                resolve(this.db);
            });
        });
    }

    /* Выполняем sql запрос */
    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
            // function(err) оставлен намеренно, чтобы иметь доступ к this.lastID и this.changes от sqlite3
            this.db.run(sql, params, function (err) {
                if (err) {
                    console.error('Run SQL error:', err);
                    reject(err);
                    return;
                }
                resolve({
                    lastId: this.lastID,
                    changes: this.changes,
                });
            });
        });
    }

    /* Получаем одну запись */
    async get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    console.error('Get SQL error:', err);
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    /* Получаем все записи */
    async all(sql, params = []) {
        return new Promise((resolve, reject) => {
            // Исправлено: вызывается db.all вместо db.get
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('All SQL error:', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    /* Закрываем бд */
    async close() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve();
                return;
            }
            this.db.close((err) => {
                if (err) {
                    console.error('Close DB error:', err);
                    reject(err);
                    return;
                }
                this.db = null;
                resolve();
            });
        });
    }
}