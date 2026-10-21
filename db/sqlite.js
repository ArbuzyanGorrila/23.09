import sqlite from 'sqlite3';

export default class SqliteLinker {
    constructor(filename) {
        this.filename = filename;
        this.db = null;
    }

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

    async run(sql, params = []) {
        return new Promise((resolve, reject) => {
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

    async all(sql, params = []) {
        return new Promise((resolve, reject) => {
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