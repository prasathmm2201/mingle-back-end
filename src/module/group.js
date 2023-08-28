import { Model } from "objection";

export class Group extends Model {
  static get tableName() {
    return "group";
  }
  static relationMappings = {
    members: {
      relation: Model.HasManyRelation,
      modelClass: __dirname + "/members",
      join: {
        from: "group.id",
        to: "members.group_id",
      },
    },
  };
}

