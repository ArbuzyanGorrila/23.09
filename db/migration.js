import SqliteLinker from './sqlite.js';

export default class Migration {
    constructor(filename) {
        this.filename = filename;
        this.linker = new SqliteLinker(this.filename);
    }

    async executeSql(sql) {
        if (!sql || typeof sql !== 'string' || sql.trim() === '') {
            return;
        }
        await this.linker.run(sql);
    }

    // Обертка для выполнения набора SQL-запросов под одним соединением
    async _runMigration(actions) {
        try {
            await this.linker.connect();
            
            if (typeof actions === 'function') {
                // Если передана функция с несколькими вызовами executeSql
                await actions((sql) => this.executeSql(sql));
            } else if (typeof actions === 'string') {
                // Если передан одиночный SQL-скрипт
                await this.executeSql(actions);
            }
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            await this.linker.close();
        }
    }

    async up(actions) {
        await this._runMigration(actions);
    }

    async down(actions) {
        await this._runMigration(actions);
    }
}