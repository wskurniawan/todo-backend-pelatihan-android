import express from 'express';
import body_parser from 'body-parser';
import mongoose from 'mongoose';
import joi, { date } from 'joi';
import response_helper from './helper/response_helper';
import { signup_types, add_todo_reguest } from './types/request_types';
import user_account_model from './models/user_account_model';
import bcrypt from 'bcrypt';
import { auth_payload_type } from './types/common_types';
import auth_helper from './helper/auth_helper';
import todo_item_model from './models/todo_item_model';

//extend express Request type definition
declare global {
   namespace Express{
      interface Request{
         user: auth_payload_type
      }
   }
}

const db_uri = <string> require('../config.json').db_uri;
const port = process.env.PORT || 5025;

const app = express();

mongoose.connect(db_uri, { useNewUrlParser: true }).then(result => {
   console.log('db connected');
});

app.use(body_parser.json());

app.get('/', function(req, res, next){
   res.send({
      success: true,
      message: 'ok'
   });
});

app.post('/signup', async function(req, res, next){
   const schema = joi.object().keys({
      username: joi.string().required(),
      password: joi.strict().required()
   });

   try {
      await joi.validate(req.body, schema);
   } catch (error) {
      response_helper.validation_error(res, <string> error.message);
   }

   next();
}, async function(req, res, next){
   const request_data = <signup_types> req.body;

   try {
      var account_data = await user_account_model.get(request_data.username);
   } catch (error) {
      return response_helper.internal_server_error(res, <string> error.message);
   }

   if(account_data != null){
      return response_helper.forbidden(res, 'username sudah digunakan');
   }

   request_data.password = bcrypt.hashSync(request_data.password, 10);

   try {
      await user_account_model.insert({ username: request_data.username, password: request_data.password });
   } catch (error) {
      return response_helper.internal_server_error(res, <string> error.message);
   }

   response_helper.success(res);
});

app.post('/signin', async function(req, res, next){
   const schema = joi.object().keys({
      username: joi.string().required(),
      password: joi.string().required()
   });

   try {
      await joi.validate(req.body, schema);
   } catch (error) {
      return response_helper.validation_error(res, <string> error.message);
   }

   next();
}, async function(req, res, next){
   const request_data = <signup_types> req.body;

   try {
      var account_data = await user_account_model.get(request_data.username);
   } catch (error) {
      return response_helper.internal_server_error(res, <string> error.message);
   }

   if(!account_data){
      return response_helper.unauthorized(res, 'username atau password salah');
   }

   if(!bcrypt.compareSync(request_data.password, account_data.password)){
      return response_helper.unauthorized(res, 'username atau password salah');
   }

   const token = auth_helper.sign({ username: account_data.username });

   response_helper.success(res, { token });
});

app.use(async function(req, res, next){
   const token = req.header('token');

   if(!token){
      return response_helper.unauthorized(res, 'sesi tidak valid');
   }

   try {
      var decode = await auth_helper.verify(token);
   } catch (error) {
      return response_helper.unauthorized(res, 'sesi tidak valid');
   }

   req.user = decode;

   next();
});

app.get('/get-todo', async function(req, res, next){
   const username = req.user.username;

   try {
      var list_todo = await todo_item_model.get_list(username);
   } catch (error) {
      return response_helper.internal_server_error(res, <string> error.message);
   }

   response_helper.success(res, { list_todo: list_todo });
});

app.post('/add-todo', async function(req, res, next){
   const schema = joi.object().keys({
      nama_kegiatan: joi.string().required(),
      timestamp: joi.number().required()
   });

   try {
      await joi.validate(req.body, schema);
   } catch (error) {
      return response_helper.validation_error(res, <string> error.message);
   }

   next();
}, async function(req, res, next){
   const request_data = <add_todo_reguest> req.body;
   console.log(req.user);

   try {
      await todo_item_model.insert({ username: req.user.username, nama_kegiatan: request_data.nama_kegiatan, timestamp: request_data.timestamp });
   } catch (error) {
      return response_helper.internal_server_error(res, error.message);
   }

   return response_helper.success(res);
});

app.listen(port, function(){
   console.log(`Server ready at port ${port}`);
});