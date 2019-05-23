import jwt from 'jsonwebtoken';
import { auth_payload_type } from '../types/common_types';

const auth_secret = <string> require('../../config.json').secret;

export function sign(payload: auth_payload_type): string{
   return jwt.sign(payload, auth_secret, { expiresIn: '2h'});
}

export async function verify(token: string): Promise<auth_payload_type>{
   try {
      var decode = <auth_payload_type> await jwt.verify(token, auth_secret)
   } catch (error) {
      return Promise.reject(error);
   }

   return Promise.resolve(decode);
}

export default {
   sign,
   verify
}