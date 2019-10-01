
module.exports = function (server) {
    var SocketHander = require('./index');
    var user = [];
    var usocket = {};
    var io = require('socket.io')(server)
    io.on('connection', async (socket) => {
        console.log('a user connected');
        socketHander = new SocketHander();
        socketHander.connect();
        //io.emit('message','hello');
        socket.on('new user', (name) => {
            socket.username = name;
            obj = { name: name, sid: socket.id }
            usocket[socket.username] = socket;
            //console.log(usocket);
            user.push(obj)
            console.log(user);
            io.emit('user', user);
            io.emit('user join', obj.name);
        });


        //var id=socket.id;
        // var history = await socketHander.getMessage();
        // console.log(history);
        // io.to(id).emit('history',history);
        socket.on('typeing', (name) => {
            console.log(socket.username + 'is typing...');
            socket.broadcast.emit('typeing', name);  //socket.broadcast.emit() 傳送給所有連線者，除了自己
        })
        socket.on('noTypeing', () => {
            console.log('no typing');
            socket.broadcast.emit('noTypeing');  //socket.broadcast.emit() 傳送給所有連線者，除了自己
        })
        socket.on('disconnect', () => {
            console.log('a user disconnect id=' + socket.username);

            io.emit('user leave', socket.username); //先返回斷線username
            user.splice(user.indexOf(socket.id), 1); // 把斷線者從連線成員組刪除
            io.emit('user', user); // 傳送新的成員組
            console.log(user);
        })


        socket.on('message', (obj) => {
            console.log(obj.msg.indexOf('@To:'))
            if (obj.msg.indexOf('@To:') == 0) {
                var arr = obj.msg.split(':');
                usocket[arr[1]].emit('private msg', { from: obj.name, To: arr[1], msg: arr[2] });
                // 一對一 使用 join room
                // usocket[socket.username].join('private');
                // usocket[arr[1]].join('private');
                // io.to('private').emit('private msg', { from: obj.name,To:arr[1], msg: arr[2] });
                console.log(arr)
                // var to = user.find((e) => {
                //     return e.name == arr[1];
                // });
            } else {
                socketHander.storeMessage(obj, function (time) {
                    obj = {
                        name: obj.name,
                        msg: obj.msg,
                        time: time
                    }
                    console.log(obj);
                    socket.broadcast.emit('message', obj);
                });
            }
        })
    })


}
