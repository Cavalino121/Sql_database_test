import { Observable } from '@nativescript/core';
import { DatabaseService } from './database/database.service';
import { User } from './models/user.model';

export class MainViewModel extends Observable {
    private databaseService: DatabaseService;
    private _users: Array<User> = [];
    private _userName: string = '';
    private _userEmail: string = '';

    constructor() {
        super();
        this.databaseService = new DatabaseService();
        this.initDatabase();
    }

    async initDatabase() {
        await this.databaseService.init();
        await this.loadUsers();
    }

    get users(): Array<User> {
        return this._users;
    }

    set users(value: Array<User>) {
        if (this._users !== value) {
            this._users = value;
            this.notifyPropertyChange('users', value);
        }
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        if (this._userName !== value) {
            this._userName = value;
            this.notifyPropertyChange('userName', value);
        }
    }

    get userEmail(): string {
        return this._userEmail;
    }

    set userEmail(value: string) {
        if (this._userEmail !== value) {
            this._userEmail = value;
            this.notifyPropertyChange('userEmail', value);
        }
    }

    async onAddUser() {
        if (this._userName && this._userEmail) {
            try {
                await this.databaseService.addUser(this._userName, this._userEmail);
                await this.loadUsers();
                this.userName = '';
                this.userEmail = '';
            } catch (error) {
                console.error('Error adding user:', error);
            }
        }
    }

    async onDeleteUser(args: any) {
        const user = args.object.bindingContext as User;
        if (user.id) {
            try {
                await this.databaseService.deleteUser(user.id);
                await this.loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    }

    private async loadUsers() {
        try {
            const users = await this.databaseService.getUsers();
            this.users = users;
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }
}