import { user_account_type } from '../types/database_types';
import mongoose, { Document, Schema, Model } from 'mongoose';

type user_account_document = Document & user_account_type;

const schema = new Schema({
   username: String,
   password: String
});

const model: Model<user_account_document> = mongoose.model('user', schema);

export async function insert(data: user_account_type): Promise<boolean>{
   try {
      await model.create(data);
   } catch (error) {
      return Promise.reject(error);
   }

   return Promise.resolve(true);
}

export async function get(username: string){
   try {
      var account_data = await model.findOne({ username: username });
   } catch (error) {
      return Promise.reject(error);
   }

   if(!account_data){
      return Promise.resolve(null);
   }

   return Promise.resolve(<user_account_type> account_data.toJSON());
}

export default {
   insert,
   get
}