// Socket.io 서버사이드 모듈

exports = module.exports = function(io) {
    io.on('connection', (socket)=> {
        socket.on("Enter", function(data) {
            console.log('소켓에서 서버로 반응 옴')
            io.to(data.socket_id).emit('Enter_reaction', {innertext : '소켓전송 성공'});
        })
    })
};