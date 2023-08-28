import { UserProfile } from "../../module"

export const getAllUsers=({
    tenantDB,
    user_id,
    search
    })=>{
        return new Promise(async(resolve , reject)=>{
            try{
                const data = await UserProfile
                .query(tenantDB)
                .select("image_url","username","id")
                .whereNot("id",user_id)
                .where((builder) => {
                    if (search) {
                        builder.where("username", "ilike", `%${search}%`);
                    }

                })

                resolve(data)
            }
            catch(err){
                reject(err)
            }
        })
    }
    