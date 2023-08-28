import bcryptjs from 'bcryptjs'
import { config } from '../../config'
import jwt from 'jsonwebtoken'
const { OAuth2Client } = require('google-auth-library')

export const hashPassword=async({value , is_decode=false , is_compare=false , compare_value})=>{
    return new Promise((resolve , reject)=>{
        try{
            if(is_decode) return resolve(bcryptjs.hashSync(value, 8))
            if(is_compare) return resolve(bcryptjs.compare(value, compare_value))

            resolve(bcryptjs.hash(value, 8))
        }
        catch(err){
          reject(err)
        }
    })
}

export const encode = (payload, expiry_time) => {
    let configure = {};
    if (expiry_time) {
      config["expiresIn"] = expiry_time;
    }
  
    return jwt.sign(payload, config.JWT, configure);
  };
  
  export const decode = (token) => {
    return jwt.decode(token, config.JWT);
  };
  
  export const verify = (token) => {
    return new Promise((resolve, reject) => {
      try {
        let payload = jwt.verify(token, config.JWT);
        resolve(payload);
      } catch (error) {
        reject(error);
      }
    });
  };
  
  export function Networkcall({
    url, method, data
}) {
    var requestOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem(LocalStoragekeys?.token) ? `Bearer ${localStorage.getItem(LocalStoragekeys?.token)}` : undefined
      },
      body: JSON.stringify(data)
    };

    return fetch(url, requestOptions)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .catch(function (error) {
        return error
      });
  }