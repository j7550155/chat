$(document).ready(function () {
    var name = $("#name").val();
    var typeing = false;
    var timeout = undefined;
    var timeoutFun = function () {
        typeing = false;
        socket.emit('noTypeing');
    }
    function typeNotSend() {
        if (typeing == false) {
            typeing = true;
            socket.emit('typeing', name);
            timeout = setTimeout(timeoutFun, 5000);
        } else { //如果已經正在輸入中又繼續輸入，重製計時器5秒
            clearTimeout(timeout);
            timeout = setTimeout(timeoutFun, 5000);
        }
    }
    var name = $('#name').val();
    $('#btn').on('click', function () {
        send();
    })
    $('#msg').on('keyup', function () {
        typeNotSend();
    })
    $(document).on('keydown', function (e) {
        if (e && e.keyCode == 13) {
            send();
        }
    })



    socket = io.connect('ws://localhost:3001');
    socket.on('connect', function () {
        console.log('connect');
        socket.emit('new user', name);
    });
    socket.on('typeing', function (name) {
        $('.typeing').html('');
        $('.typeing').append(name + ' 正在輸入中...')
    });
    socket.on('noTypeing', function (name) {
        $('.typeing').html('');

    });
    socket.on('user', function (user) {
        $(".users").html('');
        var data = '';
        user.forEach(e => {
            data += "<div class='user' id='" + e.sid + "'>" + e.name + "</div>";
        })
        //console.log(data)
        $(".users").append(data)
        $('.user').on('click', function () {
            console.log(this.id)
            var user = $(this).html();
            $('#msg').val("@To:" + user + ":");
        })
    });

    socket.on('user join', function (user) {
        console.log(user + ' join');
        $('.chat').append('<div class="group"><div class="system">' + user + ' 加入聊天室</div></div>')

    });


    socket.on('user leave', function (user) {
        $('.chat').append('<div class="group"><div class="system">' + user + ' 離開聊天室</div></div>')
    });
    function send() {

        var name = $("#name").val();
        var msg = $('#msg').val();
        // alert(name+msg);
        if (!(msg && name)) {
            alert('請輸入完整格式')
            return;
        }

        var data = {
            name: name,
            msg: msg,
        }
        $('.chat').append("<div class='private-group'><div class='own-msg'>" + msg + "</div></div>");
        socket.emit('message', data);
        $('#msg').val('');
        $('.chat').scrollTop($('.chat').height());
    }

    socket.on('message', (obj) => {

        getMsg([obj]);

    })

    socket.on('private msg', function (obj) {
        console.log(obj);
        var pre = $('.chat').html();
        var data = '';
        data += "<div class='private-group'><div class='user'>" + obj.from + ">>: </div><div class='msg'>" + obj.msg + "</div><div class='time'>" + moment(obj.time).fromNow() + '</div></div>'
        $('.chat').append(data);
        $('.chat').scrollTop($('.chat').height());
    });
    socket.on('history', (obj) => {

        if (obj.length > 0) {
            getMsg(obj);
        }

    })
    function getMsg(obj) {
        var pre = $('.chat').html();
        // var data=pre+=data;
        //"<div class='group'><div class='user'>" + element.name + "</div><div class='msg'>" + element.msg + "</div><div class='time'>" + element.time + '</div></div>';
        var data = '';
        obj.forEach(element => {
            data += "<div class='group'><div class='user'>" + element.name + ": </div><div class='msg'>" + element.msg + "</div><div class='time'>" + moment(element.time).fromNow() + '</div></div>'
        });

        // pre+="<div class='group'><div class='user'>" + obj.name + ": </div><div class='msg'>" + obj.msg + "</div><div class='time'>" + obj.time+ '</div></div>';
        //  $('.chat').html(pre);
        //var data ="<div class='group'><div class='user'>" + obj.name + ": </div><div class='msg'>" + obj.msg + "</div><div class='time'>" + obj.time+ '</div></div>';
        $('.chat').append(data);
        $('.chat').scrollTop($('.chat').height());
        // moment().fromNow() ;
    }
})

// socket = io.connect('ws://localhost:3001');


// socket.on('message',(obj)=>{
//     console.log(obj);
// })
// var data={
//     name:"john",
//     msg:"666",
// }
// socket.emit('message',data);