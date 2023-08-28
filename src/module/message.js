import { Model } from "objection";

export class Message extends Model {
  static get tableName() {
    return "message";
  }
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/userProfile",
      join: {
        from: "message.sender",
        to: "user_profiles.id",
      },
    },
    sender: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/userProfile",
      join: {
        from: "message.sender",
        to: "user_profiles.id",
      },
    },
    group: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/group",
      join: {
        from: "message.group_id",
        to: "group.id",
      },
    },
    group_receivers: {
      relation: Model.BelongsToOneRelation,
      modelClass: __dirname + "/receivers",
      join: {
        from: "receivers.receivers",
        to: "user_profiles.id",
      },
    },
  };
}

