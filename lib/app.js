var express = require('express'),
    http = require('http'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs'),
    path = require('path');

// Define the port to run on
app.set('port', 1334);

app.use(express.static(path.join(__dirname, 'public')));

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
});
var points = [];
// Chargement de socket.io
var io = require('socket.io').listen(server);
paint = io.of('/JavaScript_Avance_my_paint').on('connection', function (socket) {
  if (points.length > 0) {
    for (var i in points) {
      socket.json.emit('paint points', points[i]);
    }
  }

  socket.on('paint points', function(data) {
      console.log(data);
    points.push(data);
    paint.emit('paint points', data);
  });
     /***************START SIZE MAP**********************/
    io.sockets.on('connection', function (socket, pseudo) {
    socket.on('canvas_front_width', function (front_width) {
        console.log('canvas_front_width : ' + front_width);
        socket.emit('canvas_front_width', front_width);
        socket.broadcast.emit('canvas_front_width', front_width);
    });
    socket.on('canvas_back_width', function (back_width) {
        console.log('canvas_back_width : ' + back_width);
        socket.emit('canvas_back_width', back_width);
        socket.broadcast.emit('canvas_back_width', back_width);
    });
    socket.on('canvas_front_height', function (front_height) {
        console.log('canvas_front_height : ' + front_height);
        socket.emit('canvas_front_height', front_height);
        socket.broadcast.emit('canvas_front_height', front_height);
    });
    socket.on('canvas_back_height', function (back_height) {
        console.log('canvas_back_height : ' + back_height);
        socket.emit('canvas_back_height', back_height);
        socket.broadcast.emit('canvas_back_height', back_height);
    });
    /***************END SIZE MAP*************************/
      /*************START CLEAR CANVAS*********************/
    socket.on('clear_canvas_back', function (clear_canvas_back) {
        console.log('clear_canvas_back : ' + clear_canvas_back);
        socket.emit('clear_canvas_back', clear_canvas_back);
        socket.broadcast.emit('clear_canvas_back', clear_canvas_back);
    });
    socket.on('clear_canvas_front', function (clear_canvas_front) {
        console.log('clear_canvas_front : ' + clear_canvas_front);
        socket.emit('clear_canvas_front', clear_canvas_front);
        socket.broadcast.emit('clear_canvas_front', clear_canvas_front);
    });
    });
    /*************END CLEAR CANVAS***********************/
});

////// Quand un client se connecte, on le note dans la console
//io.sockets.on('connection', function (socket, pseudo) {
//    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
//    socket.on('nouveau_client', function(pseudo) {
//        console.log(pseudo + ' est connecté !');
//        pseudo = ent.encode(pseudo);
//        socket.pseudo = pseudo;
//        socket.broadcast.emit('nouveau_client', pseudo);
//    });
//    /***************START SIZE MAP**********************/
//    socket.on('canvas_front_width', function (front_width) {
//        console.log('canvas_front_width : ' + front_width);
//        socket.emit('canvas_front_width', front_width);
//        socket.broadcast.emit('canvas_front_width', front_width);
//    });
//    socket.on('canvas_back_width', function (back_width) {
//        console.log('canvas_back_width : ' + back_width);
//        socket.emit('canvas_back_width', back_width);
//        socket.broadcast.emit('canvas_back_width', back_width);
//    });
//    socket.on('canvas_front_height', function (front_height) {
//        console.log('canvas_front_height : ' + front_height);
//        socket.emit('canvas_front_height', front_height);
//        socket.broadcast.emit('canvas_front_height', front_height);
//    });
//    socket.on('canvas_back_height', function (back_height) {
//        console.log('canvas_back_height : ' + back_height);
//        socket.emit('canvas_back_height', back_height);
//        socket.broadcast.emit('canvas_back_height', back_height);
//    });
//    /***************END SIZE MAP*************************/
//    /***************START MOUSE POSITION*****************/
//    socket.on('mouseX', function (mouseX) {
//        console.log('mouseX : ' + mouseX);
//        socket.emit('mouseX', mouseX);
//        socket.broadcast.emit('mouseX', mouseX);
//    });
//    socket.on('mouseY', function (mouseY) {
//        console.log('mouseY : ' + mouseY);
//        socket.emit('mouseY', mouseY);
//        socket.broadcast.emit('mouseY', mouseY);
//    });
//    socket.on('mouseXl', function (mouseXl) {
//        console.log('mouseXl : ' + mouseXl);
//        socket.emit('mouseXl', mouseXl);
//        socket.broadcast.emit('mouseXl', mouseXl);
//    });
//    socket.on('mouseYl', function (mouseYl) {
//        console.log('mouseYl : ' + mouseYl);
//        socket.emit('mouseYl', mouseYl);
//        socket.broadcast.emit('mouseYl', mouseYl);
//    });
//    /*************END MOUSE POSITION*********************/
//    /*************START CLEAR CANVAS*********************/
//    socket.on('clear_canvas_back', function (clear_canvas_back) {
//        console.log('clear_canvas_back : ' + clear_canvas_back);
//        socket.emit('clear_canvas_back', clear_canvas_back);
//        socket.broadcast.emit('clear_canvas_back', clear_canvas_back);
//    });
//    socket.on('clear_canvas_front', function (clear_canvas_front) {
//        console.log('clear_canvas_front : ' + clear_canvas_front);
//        socket.emit('clear_canvas_front', clear_canvas_front);
//        socket.broadcast.emit('clear_canvas_front', clear_canvas_front);
//    });
//    /*************END CLEAR CANVAS***********************/
//    /*************START CLASS ACTIVE*********************/
//     socket.on('addAllHAndlers1', function (addAllHAndlers1) {
//        console.log('addAllHAndlers1 : ' + addAllHAndlers1);
//        socket.emit('addAllHAndlers1', addAllHAndlers1);
//        socket.broadcast.emit('addAllHAndlers1', addAllHAndlers1);
//    });
//    socket.on('addAllHAndlers2', function (addAllHAndlers2) {
//        console.log('addAllHAndlers2 : ' + addAllHAndlers2);
//        socket.emit('addAllHAndlers2', addAllHAndlers2);
//        socket.broadcast.emit('addAllHAndlers2', addAllHAndlers2);
//    });
//    /*************END CLASS ACTIVE*********************/
//    /**************STATUS TOOLS************************/
//    socket.on('status_rect', function (status_rect) {
//        console.log('status_rect : ' + status_rect);
//        socket.emit('status_rect', status_rect);
//        socket.broadcast.emit('status_rect', status_rect);
//    });
//    socket.on('status_eraser', function (status_eraser) {
//        console.log('status_eraser : ' + status_eraser);
//        socket.emit('status_eraser', status_eraser);
//        socket.broadcast.emit('status_eraser', status_eraser);
//    });
//    socket.on('status_pencil', function (status_pencil) {
//        console.log('status_pencil : ' + status_pencil);
//        socket.emit('status_pencil', status_pencil);
//        socket.broadcast.emit('status_pencil', status_pencil);
//    });
//    socket.on('status_line', function (status_line) {
//        console.log('status_line : ' + status_line);
//        socket.emit('status_line', status_line);
//        socket.broadcast.emit('status_line', status_line);
//    });
//    socket.on('status_circlee', function (status_circlee) {
//        console.log('status_circlee : ' + status_circlee);
//        socket.emit('status_circlee', status_circlee);
//        socket.broadcast.emit('status_circlee', status_circlee);
//    });
//    socket.on('status_polygon', function (status_polygon) {
//        console.log('status_polygon : ' + status_polygon);
//        socket.emit('status_polygon', status_polygon);
//        socket.broadcast.emit('status_polygon', status_polygon);
//    });
//    /****************END STATUS TOOLS*******************/
//    /**************LISTEN CANVAS TOOLS************************/
//    socket.on('drawCircle_drag', function (drawCircle) {
//        console.log('drawCircle_drag : ' + drawCircle);
//        socket.broadcast.emit('drawCircle', drawCircle);
//    });
//     socket.on('drawCircle_dragStop', function (drawCircle) {
//        console.log('drawCircle_dragStop : ' + drawCircle);
//        socket.broadcast.emit('drawCircle_dragStop', drawCircle);
//    });
//    socket.on('ctxbb_drag', function (ctxb) {
//        console.log(ctxb);
//        socket.broadcast.emit('ctxbb_drag', ctxb);
//    });
//    socket.on('ctxff_drag', function (ctxf) {
//        console.log(ctxf);
//        socket.broadcast.emit('ctxff_drag', ctxf);
//    });
//    socket.on('ctxbb_stop', function (ctxb) {
//        console.log(ctxb);
//        socket.broadcast.emit('ctxbb_stop', ctxb);
//    });
//    socket.on('ctxff_stop', function (ctxf) {
//        console.log(ctxf);
//        socket.broadcast.emit('ctxff_stop', ctxf);
//    });
//    socket.on('ctxbb_lineTo', function (ctxb) {
//        console.log(ctxb);
//        //socket.broadcast.emit('ctxbb_lineTo', ctxb);
//    });
//    /****************LISTEN CANVAS TOOLS*******************/
//    
//});