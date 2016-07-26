'use strict';

/**
 * Database
 */
export class Database {
  private _uri: string;
  set uri(uri: string) {
    this._uri = uri;
  }
  get uri(): string {
    return this._uri;
  }
}