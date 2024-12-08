import { Injectable } from '@nativescript/core';
import * as SqliteDb from 'nativescript-sqlite';

@Injectable()
export class DatabaseService {
    private database: any;

    public async init(): Promise<void> {
        if (!this.database) {
            this.database = await new SqliteDb('mydb.db');
            await this.createTables();
        }
    }

    private async createTables(): Promise<void> {
        await this.database.execSQL(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    public async addUser(name: string, email: string): Promise<void> {
        await this.database.execSQL(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );
    }

    public async getUsers(): Promise<any[]> {
        const rows = await this.database.all('SELECT * FROM users');
        return rows;
    }

    public async getUserById(id: number): Promise<any> {
        const rows = await this.database.all(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    public async deleteUser(id: number): Promise<void> {
        await this.database.execSQL(
            'DELETE FROM users WHERE id = ?',
            [id]
        );
    }
}