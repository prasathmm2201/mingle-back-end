import { Model } from "objection";

export class UserProfile extends Model {
  static get tableName() {
    return "user_profiles";
  }
  static relationMappings = {
    message: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + "/message",
      join: {
        from: "user_profiles.id",
        to: "message.sender",
      },
    },
    sender_message: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + "/receivers",
      join: {
        from: "user_profiles.id",
        to: "receivers.receivers",
      },
    }
  };
  
}

