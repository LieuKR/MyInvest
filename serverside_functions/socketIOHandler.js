// Socket.io 서버사이드 모듈
const MySqlHandler = require('./MySqlHandler.js');

exports = module.exports = function(io) {
    // 소켓이 서버에 들어올때의 이벤트들
    io.on('connection', (socket)=> {
        // 아이디 유효성 체크
        socket.on("checkID", function(data) {
            if (!/^[a-zA-Z0-9]{8,20}$/.test(data.postdata)){
                io.to(data.socket_id).emit('idcheck', {checkvalue : 2});
            } else {
                MySqlHandler.myinvest_mainDB.query(`SELECT EXISTS (SELECT \`id\` FROM \`users\` WHERE \`id\`='${data.postdata}') as success`,
                (err, rows1) => {
                    if(rows1[0].success == 1){
                        io.to(data.socket_id).emit('idcheck', {checkvalue : 1});
                    } else {
                        io.to(data.socket_id).emit('idcheck', {checkvalue : 0});
                    }
                })
            };
        });

        // 이메일 유효성 체크
        socket.on("checkEmail", function(data) {
            let emailRule = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i; //이메일 정규식
            if (!emailRule.test(data.postdata)){
                io.to(data.socket_id).emit('mailcheck', {checkvalue : 2});
            } else {
                MySqlHandler.myinvest_mainDB.query(`SELECT EXISTS (SELECT \`email\` FROM \`users\` WHERE \`email\`='${data.postdata}') as success`,
                (err, rows1) => {
                  if(rows1[0].success == 1){
                    io.to(data.socket_id).emit('mailcheck', {checkvalue : 1});
                  } else {
                    io.to(data.socket_id).emit('mailcheck', {checkvalue : 0});
                  }
                })
            };
        });

        socket.on("checkName", function(data) {
            MySqlHandler.myinvest_mainDB.query(`SELECT EXISTS (SELECT \`name\` FROM \`users\` WHERE \`name\`='${data.postdata}') as success`,
                (err, rows1) => {
                    if(rows1[0].success == 1){
                        io.to(data.socket_id).emit('Name_check', {checkvalue : 1});
                    } else if (data.postdata == '') {
                        io.to(data.socket_id).emit('Name_check', {checkvalue : 0});
                    } else{
                        io.to(data.socket_id).emit('Name_check', {checkvalue : 2});
                    }

                })
        });
    })
};