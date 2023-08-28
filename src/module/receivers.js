import { Model } from "objection";

export class Receivers extends Model {
  static get tableName() {
    return "receivers";
  }
  static relationMappings = {
    sender: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/userProfile",
      join: {
        from: "receivers.receivers",
        to: "user_profiles.id",
      },
    },
    message: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/message",
      join: {
        from: "receivers.message_id",
        to: "message.id",
      },
    },
  };
}

