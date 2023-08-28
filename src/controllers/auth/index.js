import { encode, hashPassword } from "../../helper/function"
import { UserProfile } from "../../module";


export const createSignUp = ({
    tenantDB,
    username,
    image_url,
    password,
    email_id,
    mobile_country_code,
    mobile_no,
    bio,
    id,
    is_verified,
    interest,
    gender,
    longitude,
    latitude,
    is_token
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (email_id) {
                const user = await UserProfile.query(tenantDB).select("id").where("email_id", username)

                if (user?.length) return reject("email already taken")
            }


            await UserProfile
                .query(tenantDB)
                .upsertGraph({
                    username,
                    image_url,
                    email_id,
                    mobile_country_code,
                    mobile_no,
                    bio,
                    id,
                    is_verified,
                    interest,
                    gender,
                    longitude,
                    latitude
                })


            if (is_token) {
                console.log('------>')
                const user = await UserProfile
                    .query(tenantDB)
                    .alias("u")
                    .select("u.email_id", "u.username", "u.image_url", "u.id", "u.is_verified", "u.image_urls")
                    .where("u.id", id)

                const token = encode({
                    logo: user?.[0]?.image_url,
                    name: user?.[0]?.username,
                    user_id: user?.[0]?.id,
                    is_verified: user?.[0]?.is_verified
                })
                console.log('------>')


                resolve({
                    msg: "user profile created sucessfully",
                    type: "success",
                    data: token

                })
            }
            else {
                resolve({
                    msg: "user profile created sucessfully",
                    type: "success",

                })
            }



        }
        catch (err) {
            console.log(err , '----')
            reject(err)
        }
    })
}

export const Login = ({
    tenantDB,
    username,
    password
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await UserProfile
                .query(tenantDB)
                .alias("u")
                .select("u.email_id", "u.username", "u.image_url", "u.id", "u.is_verified", "u.image_urls")
                .where("u.email_id", username)
                .orWhere("u.username", username)

            if (!user?.length) return reject({ type: "Error", message: "User or Email not exists" })

            const token = encode({
                logo: user?.[0]?.image_urls,
                name: user?.[0]?.username,
                user_id: user?.[0]?.id,
                is_verified: user?.[0]?.is_verified
            })
            resolve({
                data: token,
                msg: "welcome back",
                type: "success",
                is_verified: user?.[0]?.is_verified,
                user_id: user?.[0]?.id
            })
        }
        catch (err) {
            reject(err)
        }
    })
}
