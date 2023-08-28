import { Model } from "objection";

export class Members extends Model {
  static get tableName() {
    return "members";
  }
}

