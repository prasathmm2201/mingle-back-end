import { Model } from "objection";

export class Unread extends Model {
  static get tableName() {
    return "un_read"
  }
}

