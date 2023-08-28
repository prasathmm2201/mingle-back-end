import express from 'express'
import OS from "os";
import { config } from './config';
import routers from "./src/routers";
import { Networkcall, decode } from './src/helper/function';
import { passport } from './passport-setup';
import {  createSignUp } from './src/controllers/auth';
import { UserProfile } from './src/module';
import DB from './DB';
import knex from 'knex';
var session = require('express-session')

const cors = require("cors");
const { Server } = require("socket.io");
export const app = express()
const PORT = config?.PORT;


const server = app.listen(PORT, () => {
  try {
    console.log(`server listing on ${PORT}`)
  }
  catch (err) {
    console.log(err)
  }
})

export const io = new Server(server, {
  cors: {
    origin: config?.FRONT_END_URL,
    credentials: true,
  },
});


export let clients = {}

io.on("connection", (socket) => {
  socket.on('setNickname', token => {
    const user = decode(token)
    if (!!clients?.[user?.user_id]) {
    } else {
      clients[user?.user_id] = socket
      socket["nickname"] = user?.user_id
      socket["users"] = user
    }
    io.emit("user_connected" , Object.keys(clients))
  });
  socket.on('privateMessage', ({ user_id,user, message,created_at ,audio}) => {
    const recipientSocket = clients[user_id];
    if (recipientSocket) {
      recipientSocket.emit('privateMessage', { user_id,user, message: `${message}`,created_at,audio });
    } else {
      socket.emit('privateMessageError', `Recipient "${user_id}" is not online`);
    }
  });
  socket.on('joinRoom', (room) => {
    socket.join(room);
    socket.emit('roomJoined', room); 
  });
  socket.on('groupchatMessage', ({ user_id, message ,user , created_at , members , audio}) => {
    io.to(user_id).emit('groupchatMessage', { user_id,user, message: `${message}`,created_at , audio });

    if(members){
      for (let i = 0; i < members.length; i++) {
        const recipientSocket = clients[members[i]];
      if (recipientSocket) {
        console.log( 'user connect')
        recipientSocket.emit('groupMessageChat', { user_id,user, message: `${message}`,created_at:new Date(created_at) });
      }
    }
     
    }
  });
  socket.on('leaveRoom', (room) => {
    socket.leave(room);
  });
  socket.on("disconnect", (data) => {
    if (socket.nickname) {
      delete clients[socket.nickname];
      io.emit("user_disconnected" , Object.keys(clients))

    }
  });
  socket.on("disconnect_online", (data) => {
    console.log(socket.nickname , 'ssksk' , data)
    if (socket.nickname) {
      delete clients[socket.nickname];
      io.emit("user_disconnected" , Object.keys(clients))
    }
  });
  socket.on('live-call', (data) => {
    console.log(data , 'data')
    if(data?.is_group){
      socket.broadcast.to(data?.sender).emit('live-call', data)
      console.log( data?.members , data?.members)

      if(data?.members){
        for (let i = 0; i < data?.members.length; i++) {
          const recipientSocket = clients[data?.members[i]];
        if (recipientSocket) {
          console.log( 'user connect')
          recipientSocket.emit('live-call', data);
        }
        }
      }
    }
    else{
      const recipientSocket = clients[data?.sender];
      if (recipientSocket) {
        recipientSocket.emit('live-call',  data );
      }
    }
  })
  socket.on("accept", (data) => {
    const recipientSocket = clients[data?.use_data?.user_id];
    if (recipientSocket) {
      recipientSocket.emit('accept',  data );
    }
  });
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    // socket.on('disconnect', () => {
    //     socket.broadcast.to(roomId).emit('user-disconnected', userId)
    // })
  })
  socket.on('end_call' , ({user , peer_id , room_id , type})=>{
    console.log(peer_id , room_id , 'peer_id , room_id')
    socket.broadcast.to(room_id).emit('user-disconnected', {peer_id , user , type})
  })
  
});

app.get('/', async (req, res) => {
  const status = {
    uptime: process.uptime(),
    message: "Server is running...",
    process_id: process.pid,
    date: new Date(),
    platform: OS.platform(),
    processor: OS.cpus()[0].model,
    architecture: OS.arch(),
    thread_count: OS.cpus().length,
    total_memory: `${(OS.totalmem() / 1e9).toFixed(2)} GB`,
    free_memory: `${(OS.freemem() / 1e9).toFixed(2)} GB`,
  };

  res.status(200).send(status)
})
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/google/callback',
  passport.authenticate('google',
    {
      failureRedirect: config?.FRONT_END_URL,
      failureFlash: true,
      session: false
    }),
  async(req, res) => {
    if (req?.user) {
      const user = await UserProfile.query(knex(DB)).alias("u").select("u.id").where("u.email_id",req?.user?.email)
      console.log(req , 'req')

      if(user?.length){
        res.redirect(`${config?.FRONT_END_URL}?status=1`)
      }
      else{
        await UserProfile
        .query(knex(DB))
        .upsertGraph({
            email_id:req?.user?.email,
            image_url:[req?.user?.picture],
            username:req?.user?.displayName
        })
        res.redirect(`${config?.FRONT_END_URL}`)
      }
    }
    else {
      res.redirect(`${config?.FRONT_END_URL}?status=2`)

    }
  }
);
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'bla bla bla'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: "20mb", extended: true }));
app.use(cors({ origin: config?.FRONT_END_URL, credentials: true }));
app.use("/", routers);






console.log(Object.keys(clients) , 'Object.keys(clients)')