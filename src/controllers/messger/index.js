import { raw, ref } from "objection"
import { Group, Members, Receivers, Unread, UserProfile } from "../../module"
import { Message } from "../../module/message"
import { clients, io } from "../../.."

export const createMessage = ({
    tenantDB,
    user_id,
    receivers = [],
    message,
    created_at,
    is_unread = [],
    group_id = null,
    audio
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            tenantDB.transaction(async (trx) => {
                if (is_unread?.length) {
                    console.log(is_unread, 'is_unread')
                    await Unread.query(trx)
                        .upsertGraph(is_unread)

                    return resolve(true)
                }

                resolve('Message Send SuccessFully')

                console.log(group_id, 'group_id')

                const message_id = await trx.table("message")
                    .insert({
                        message,
                        sender: user_id,
                        created_at,
                        group_id,
                        audio: audio ?? undefined
                    })
                    .onConflict("id")
                    .merge()
                    .returning(["id"]);

                if (receivers?.length) {
                    await Receivers.query(trx).upsertGraph(
                        receivers?.map((x) => {
                            return {
                                receivers: x,
                                message_id: message_id?.[0]?.id
                            }
                        }))
                }



            })


        }
        catch (err) {
            reject(err)
        }
    })
}


export const getMessageByUser = ({
    user_id,
    tenantDB,
    receiver_id,
    offset = 0,
    limit = 10
}) => {
    return new Promise(async (resolve, reject) => {
        try {

            const query = await Message
                .query(tenantDB)
                .alias("m")
                .select([
                    `m.id`,
                    `m.message`,
                    `m.created_at`,
                    `u.username`,
                    `u.image_url as logo`,
                    `u.id as user_id`,
                    `m.audio`,
                    Unread.query(tenantDB)
                        .alias("un")
                        .count("un.id")
                        .where("un.message", ref("m.id"))
                        .andWhere("un.user", user_id)
                        .as("is_unread")
                ])
                .innerJoin('user_profiles as u', 'u.id', 'm.sender')
                .innerJoin('receivers as r', 'r.message_id', 'm.id')
                .where("m.sender", user_id)
                .whereIn("r.receivers", receiver_id)
                .union(
                    Message
                        .query(tenantDB)
                        .alias("m")
                        .select([
                            `m.id`,
                            `m.message`,
                            `m.created_at`,
                            `u.username`,
                            `u.image_url as logo`,
                            `u.id as user_id`,
                            `m.audio`,
                            Unread.query(tenantDB)
                            .alias("un")
                            .count("un.id")
                            .where("un.message", ref("m.id"))
                            .andWhere("un.user", user_id)
                            .as("is_unread")

                        ])
                        .innerJoin('user_profiles as u', 'u.id', 'm.sender')
                        .innerJoin('receivers as r', 'r.message_id', 'm.id')
                        .whereIn("m.sender", receiver_id)
                        .where("r.receivers", user_id)
                )
                .orderBy('created_at', 'DESC')
                .offset(offset)
                .limit(limit)


                resolve(query?.reverse()?.map((x)=>{
                    return{
                        ...x,
                        is_unread:x?.is_unread === "0" ? true : false,
                        read:x?.is_unread
                    }
                }))

        }
        catch (err) {
            reject(err)
        }
    })
}

export const getMessage = ({
    user_id,
    tenantDB,
    // offset = 0,
    // limit = 10,
    search
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(user_id , 'user_id')
            const query = UserProfile
                .query(tenantDB).alias("u")
                .select(
                    "u.id", "u.username", "u.image_url as image_urls",

                    Message.query(tenantDB)
                        .alias("m")
                        .count("m.id")
                        .innerJoin('receivers as r', 'r.message_id', 'm.id')
                        .leftJoin('un_read as un', 'un.message', 'm.id')
                        .where("r.receivers", user_id)
                        .where("m.sender", ref("u.id"))
                        .whereNull("un.message")
                        .whereNull("un.user")
                        .as("count"),

                    Message.query(tenantDB)
                        .alias("m")
                        .select("m.message")
                        .innerJoin('receivers as r', 'r.message_id', 'm.id')
                        .where("m.sender", ref("u.id"))
                        .where("r.receivers", user_id)
                        .orderBy("m.created_at", "desc")
                        .limit(1)
                        .as("previous_message"),

                        Message.query(tenantDB)
                        .alias("m")
                        .select("m.created_at")
                        .innerJoin('receivers as r', 'r.message_id', 'm.id')
                        .leftJoin('un_read as un', 'un.message', 'm.id')
                        .where("r.receivers", user_id)
                        .where("m.sender", ref("u.id"))
                        .whereNull("un.message")
                        .whereNull("un.user")
                        .orderBy("m.created_at", "desc")
                        .limit(1)
                        .as("created_at")
                )
                .where((builder) => {
                    if (search) {
                        builder.where("u.username", "ilike", `%${search}%`);
                    }

                })
                .whereNot("u.id", user_id)


            const query1 = Group
                .query(tenantDB).alias("g")
                .select(
                    "g.id", "g.name as username", "g.logo as image_urls",
                    raw(`CASE WHEN "g"."id" IS NOT NULL THEN true ELSE false END`).as("is_group"),
                        Message.query(tenantDB)
                        .alias("m")
                        .count("m.id")
                        .leftJoin('un_read as un', 'un.message', 'm.id')
                        .where("m.group_id", ref("g.id"))
                        .whereNot("m.sender" , user_id)
                        .whereNull("un.message")
                        .whereNull("un.user")
                        .as("count"),

                    Message.query(tenantDB)
                        .alias("m")
                        .select("m.message")
                        .where("m.group_id", ref("g.id"))
                        .orderBy("m.created_at", "desc")
                        .limit(1)
                        .as("previous_message"),

                        Message.query(tenantDB)
                        .alias("m")
                        .select("m.created_at")
                        .leftJoin('un_read as un', 'un.message', 'm.id')
                        .where("m.group_id", ref("g.id"))
                        .whereNot("m.sender" , user_id)
                        .whereNull("un.message")
                        .whereNull("un.user")
                        .orderBy("m.created_at", "desc")
                        .limit(1)
                        .as("created_at"),

                    // Message.query(tenantDB)
                    //     .alias("m")
                    //     .select("m.created_at")
                    //     .leftJoin('un_read as un', 'un.message', 'm.id')
                    //     .where("m.id", ref("g.id"))
                    //     .whereNull("un.group_id")
                    //     .whereNull("un.message")
                    //     .orderBy("m.created_at", "desc")
                    //     .limit(1)
                    //     .as("created_at")

                )
                .withGraphFetched('members(selectedMembers)')
                .modifiers({
                    selectedMembers: (builder) => {
                        builder.select("user")
                        builder.whereNot("user", user_id)

                    }
                })
                .innerJoin("members as m", "m.group_id", "g.id")
                .where((builder) => {
                    if (search) {
                        builder.where("g.name", "ilike", `%${search}%`);
                    }

                })
                .where("m.user", user_id)


            const [message, group] = await Promise.all([
                query,
                query1
            ])

            resolve([...group, ...message])


        }
        catch (err) {
            reject(err)
        }
    })
}

export const createGroup = ({
    tenantDB,
    user_id,
    name,
    logo,
    id,
    users = []
}) => {
    return new Promise((resolve, reject) => {
        try {
            tenantDB.transaction(async (trx) => {
                const group = await Group.query(trx).select("id").where("name", name).where("is_active", true)

                if (group?.length) return resolve({
                    type: "error",
                    msg: "Group name is already exists"
                })

                const updated_by = id ? user_id : undefined
                const group_id = await trx.table("group")
                    .insert({
                        created_by: user_id,
                        updated_by,
                        name,
                        logo
                    })
                    .onConflict("id")
                    .merge()
                    .returning(["id"]);

                await Members.query(trx).upsertGraph([...users, user_id]?.map((x) => {
                    return {
                        group_id: group_id?.[0]?.id,
                        user: x
                    }
                }))
                const members = [...users, user_id]
                if (members) {
                    for (let i = 0; i < members.length; i++) {
                        const recipientSocket = clients[members[i]];

                        if (recipientSocket) {
                            recipientSocket.emit('createGroup', { id: group_id?.[0]?.id, user_id: group_id?.[0]?.id, username: name, image_urls: logo, is_group: true, members });
                        }
                    }

                }

                resolve("Group Upsert SucessFUlly")

            })


        }
        catch (err) {
            reject(err)
        }
    })
}

export const getGroupMessage = ({
    group_id,
    tenantDB,
    offset = 0,
    limit = 10,
    user_id
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!group_id) {
                return reject({
                    type: "error",
                    msg: "group id must not be empty"
                })
            }
            const query = await Message
                .query(tenantDB)
                .alias("m")
                .select([
                    `m.id`,
                    `m.message`,
                    `m.created_at`,
                    `u.username`,
                    `u.image_url as logo`,
                    `u.id as user_id`,
                    `m.audio`,
                    Unread.query(tenantDB)
                        .alias("un")
                        .count("un.id")
                        .where("un.message", ref("m.id"))
                        .andWhere("un.user", user_id)
                        .as("is_unread")
                ])
                .innerJoin('user_profiles as u', 'u.id', 'm.sender')
                .leftJoin("un_read as un", "un.group_id", "m.group_id")
                .where("m.group_id", group_id)
                .orderBy('created_at', 'DESC')
                .offset(offset)
                .limit(limit);



            resolve(query?.reverse()?.map((x)=>{
                return{
                    ...x,
                    is_unread:x?.is_unread === "0" ? true : false
                }
            }))


        }
        catch (err) {
            reject(err)
        }
    })
}