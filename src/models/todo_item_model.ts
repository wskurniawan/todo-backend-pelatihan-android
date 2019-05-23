import mongoose, { Model } from 'mongoose';
import { todo_item_type } from '../types/database_types';

type todo_item_document = mongoose.Document & todo_item_type;

const schema = new mongoose.Schema({
   nama_kegiatan: String,
   timestamp: Number,
   username: String
});

const model: Model<todo_item_document> = mongoose.model('todo_item', schema);

export async function insert(data: todo_item_type): Promise<boolean>{
   try {
      await model.create(data);
   } catch (error) {
      return Promise.reject(error);
   }

   return Promise.resolve(true);
}

export async function get_list(username: string): Promise<todo_item_type[]>{
   try {
      var list_todo = await model.find({ username: username });
   } catch (error) {
      return Promise.reject(error);
   }

   if(list_todo.length === 0){
      return Promise.resolve([]);
   }

   var result_list: todo_item_type[] = [];

   try {
      await list_todo.map((value) => {
         result_list.push(<todo_item_type> value);
      });
   } catch (error) {
      return Promise.reject(error);
   }

   return Promise.resolve(result_list);
}

export default {
   insert,
   get_list
}