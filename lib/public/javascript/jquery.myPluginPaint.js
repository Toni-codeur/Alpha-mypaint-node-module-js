(function($) {
    $.fn.myPluginPaint = function() {
    console.log("welcome in my plugin create by Toni");
    document.getElementById('controls').innerHTML += "\
        <div id='clear' class='container-paint'> \
        <p><input class='btn btn-default' type='button' id='clear-canvas' value='Clear'></p> \
            <input class='btn btn-default' type='file' id='img-file' value='Fichier'>\
            <p class='name'>Setting</p>\
        </div>\
        <div id='size' class='container-paint'>\
            <p>\
                <label for='canvas-width'>Largeur</label>\
                <input type='number'  id='canvas-width' value='800' min='0'>\
            </p>\
                <label for='canvas-height'>Hauteur</label>\
                <input type='number' id='canvas-height'value='400' min='0'>\
            <p class='name'>Taille</p>\
        </div>\
         <div id='mouse-position' class='container-paint'>\
            <p>\
                <label>MouseX : </label><label id='mouseX'>0</label>\
            </p>\
                <label>MouseY : </label><label id='mouseY'>0</label>\
                <p class='name'>Position</p>\
        </div>\
        <div id='tools' class='container-paint'>\
            <div id='tool-images'>\
                <img id='pencil' src='images/tools/pencil.png'>\
                <img id='eraser' src='images/tools/eraser.png'>\
                <img id='line' src='images/tools/line.png'>\
                <img id='circlee' src='images/tools/circle.png'>\
                <img id='rectangle' src='images/tools/rectangle.png'>\
                <img id='polygon' src='images/tools/hexagon.png'>\
                <img id='circlee-v' src='images/tools/circle-v.png'>\
                <img id='rectangle-v' src='images/tools/rectangle-v.png'>\
                <img id='polygon-v' src='images/tools/hexagon-v.png'>\
            </div>\
            <p class='name'>Outils</p>\
        </div>\
        <div id='tool-size' class='container-paint'>\
            <details open>\
                <summary>Taille</summary>\
                <ul>\
                    <li id='small'>Petit</li>\
                    <li id='middle'>Moyen</li>\
                    <li id='big'>Grand</li>\
                </ul>\
            </details>\
            <p class='name'>Taille outil</p>\
        </div>\
        <div id='color' class='container-paint'>\
            <input type='color'>\
            <p class='name'>Couleur</p>\
        </div>\
        <div id='liste-calque' class='container-paint'>\
            <input type='text'  id='calque' placeholder='Name calque' onchange='new_calque()'>\
            <details open>\
                <summary>Calque</summary>\
                <ul id='liste-result-calque'>\
                   <li class='liste-result-calque'></li>\
                </ul>\
            </details>\
            <p class='name'>Calque</p>\
        </div>\
        <div id='save' class='container-paint'>\
                <p><a id='download' download='image.png'><button type='button' onClick='download()'>Download</button></a></p>\
            <p><button type='button' id='duplicat' onClick='duplicat()'>Duplicat</button></p>\
            <p class='name'>Options</p>\
        </div>\
        <div id='connect-liste' class='container-paint'>\
            <details open>\
                <summary>Liste Connect</summary>\
                <ul id='liste-result'>\
                   <li class='liste-result'></li>\
                </ul>\
            </details>\
            <p class='name'>Utilisateur connecté</p>\
        </div>\
        <div class='clear'></div>\
    </div>\
    <div id='canvases' class='col-md-12'>\
        <canvas id='back-canvas' width='800' height='400'></canvas>\
        <canvas id='front-canvas' width='800' height='400'></canvas>\
        <div id='ajout-canvas'></div>\
    </div>\
    <div id='properties' class='col-md-12'>\
        <p id='properties-title'>Image</p>\
        <p><label>Width : </label><input id='img-width' type='number' min='0'></p>\
        <p><label>Height : </label><input id='img-height' type='number' min='0'></p>\
        <input type='button' value='Inverser' id='invert'>\
    </div>\
    <section id='zone_paint' class='col-md-12'></section>";
    var socket = io.connect('http://localhost:1334');
    var paint = new io.connect('/JavaScript_Avance_my_paint');
      paint.on('paint points', function(points) {
        painting(points);
      });
    var pseudo = prompt('Quel est votre pseudo ?');
    var positioning = null;
    var dragging = false,
        snapshot,
        dragStartLocation;
    var canvasFront     =   document.getElementById('front-canvas'),
        canvasBack      =   document.getElementById('back-canvas'),
        ctxf            =   canvasFront.getContext('2d'),
        ctxb            =   canvasBack.getContext('2d');

    var canvasWidth     =   document.getElementById('canvas-width'),
        canvasHeight    =   document.getElementById('canvas-height');

    var canvasPosition;

    var mouseX, mouseY,
        mouseXl         =   document.getElementById('mouseX'),
        mouseYl         =   document.getElementById('mouseY');

    var tools           =   [],
        sizes           =   [];
    var status_circlee  =   false,
        status_eraser   =   false,
        status_line     =   false, 
        status_pencil   =   false,
        status_rect     =   false,
        status_polygon  =   false,
        status_rect_v   =   false,
        status_polygon_v =  false,
        status_circlee_v =  false; 

    tools.pencil        =   document.getElementById('pencil'),
    tools.eraser        =   document.getElementById('eraser'),
    tools.circlee       =   document.getElementById('circlee'),
    tools.line          =   document.getElementById('line'),
    tools.polygon       =   document.getElementById('polygon'),
    tools.rect          =   document.getElementById('rectangle'),
    tools.circlee_v     =   document.getElementById('circlee-v'),
    tools.polygon_v     =   document.getElementById('polygon-v'),
    tools.rect_v        =   document.getElementById('rectangle-v'),

    sizes.small         =   document.getElementById('small'),
    sizes.middle        =   document.getElementById('middle'),
    sizes.big           =   document.getElementById('big');

    var eraserSize      =   8,
        eraserCursor    =   "url('images/cursor/eraser.png'), auto";
    var pencilCursor    =   "url('images/cursor/pencil.png'), auto",
        polygonCursor   =   "url('images/tools/hexagon.png'), auto",
        circleCursor    =   "url('images/tools/circle.png'), auto",
        lineCursor      =   "url('images/tools/line.png'), auto",
        rectCursor      =   "url('images/tools/rect.png'), auto";

    var canvasClear     =   document.getElementById('clear-canvas'),
        fileImg         =   document.getElementById('img-file'),
        properties      =   document.getElementById('properties'),
        imgWidth        =   document.getElementById('img-width'),
        imgHeight       =   document.getElementById('img-height');

    var startX          =   100,
        startY          =   100;
    function new_calque() {
        var nom = document.getElementById("calque" ).value;
        $('.liste-result-calque').append('<li>' + nom + '</li>');
        document.getElementById('front-canvas').innerHTML += '<canvas id="'+ nom +'" width="'+ canvasWidth.value +'" height="'+ canvasHeight.value +'"></canvas>';
     } 
    function duplicat() {
        var duplicat = document.getElementById("duplicate");
    }
    function download() {
        var download = document.getElementById("download");
        var image = document.getElementById("back-canvas").toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
        download.setAttribute("href", image);
    }
    window.onload = function() {
        canvasPosition = canvasBack.getBoundingClientRect();
    }
    socket.emit('nouveau_client', pseudo);
        document.title = pseudo + ' - ' + document.title;
      // Quand un nouveau client se connecte, on affiche l'information
        socket.on('nouveau_client', function(pseudo) {
            //alert(pseudo);
            document.getElementById('liste-result').append('<li>' + pseudo + '</li>');
        })

    socket.emit('canvas_front_width', canvasWidth.value);
    socket.on('canvas_front_width', function(canvas_front_width) {
        console.log(canvas_front_width);
        canvasFront.width = canvas_front_width;
    })
    socket.emit('canvas_back_width', canvasWidth.value);
    socket.on('canvas_back_width', function(canvas_back_width) {
        console.log(canvas_back_width);
        canvasBack.width = canvas_back_width;
    })
    socket.emit('canvas_front_height', canvasHeight.value);
    socket.on('canvas_front_height', function(canvas_front_height) {
        console.log(canvas_front_height);
        canvasBack.height = canvas_front_height;
    })
    socket.emit('canvas_back_height', canvasHeight.value);
    socket.on('canvas_back_height', function(canvas_back_height) {
        console.log(canvas_back_height);
        canvasBack.height = canvas_back_height;
    })

    canvasWidth.onchange = function() {
        socket.emit('canvas_front_width', canvasWidth.value);
        socket.on('canvas_front_width', function(canvas_front_width) {
            console.log(canvas_front_width);
            canvasFront.width = canvas_front_width;
        })
        socket.emit('canvas_back_width', canvasWidth.value);
        socket.on('canvas_back_width', function(canvas_back_width) {
            console.log(canvas_back_width);
            canvasBack.width = canvas_back_width;
        })
        //canvasFront.width = canvasWidth.value;
        //canvasBack.width = canvasWidth.value;
    }
    canvasHeight.onchange = function() {
        socket.emit('canvas_front_height', canvasHeight.value);
        socket.on('canvas_front_height', function(canvas_front_height) {
            console.log(canvas_front_height);
            canvasBack.width = canvas_front_height;
        })
        socket.emit('canvas_back_height', canvasHeight.value);
        socket.on('canvas_back_height', function(canvas_back_height) {
            console.log(canvas_back_height);
            canvasBack.width = canvas_back_height;
        })
        //canvasFront.height = canvasHeight.value;
        //canvasBack.height = canvasHeight.value;
    }

    canvasFront.onmousemove = function(e) {
         socket.emit('mouseX', mouseX = e.clientX - canvasPosition.left);
        socket.on('mouseX', function(mouseX) {
            //console.log(mouseX);
            mouseX = e.clientX - canvasPosition.left;
        })
        socket.emit('mouseY', mouseY = e.clientY - canvasPosition.top);
        socket.on('mouseY', function(mouseY) {
            //console.log(mouseY);
            mouseY = e.clientY - canvasPosition.top;
        })
        socket.emit('mouseXl', mouseXl.innerHTML = mouseX);
        socket.on('mouseXl', function(mouseXl) {
           //console.log(mouseXl);
            mouseXl.innerHTML = mouseX;
        })
        socket.emit('mouseYl', mouseYl.innerHTML = mouseY);
        socket.on('mouseYl', function(mouseYl) {
            //console.log(mouseYl);
            mouseYl.innerHTML = mouseY;
        })
    }
    canvasClear.onclick = function () {
        socket.emit('clear_canvas_back', canvasBack.width = canvasBack.width);
        socket.on('clear_canvas_back', function(clear_canvas_back) {
            console.log('clear_canvas_back : ' + clear_canvas_back);
            canvasBack.width = clear_canvas_back;
        })
        socket.emit('clear_canvas_front', canvasBack.width = canvasFront.width);
        socket.on('clear_canvas_front', function(clear_canvas_front) {
            console.log('clear_canvas_front : ' + clear_canvas_front);
            canvasFront.width = clear_canvas_front;
        })
        canvasBack.width = canvasBack.width;
        canvasFront.width = canvasFront.width;
    }
    socket.emit('addAllHAndlers1', addAllHAndlers(tools, "tool-active"));
        socket.on('addAllHAndlers1', function(addAllHAndlers1) {
            console.log('addAllHAndlers1 : ' + addAllHAndlers1);
            addAllHAndlers(tools, "tool-active");
        })
    socket.emit('addAllHAndlers2', addAllHAndlers(sizes, "size-active"));
        socket.on('addAllHAndlers2', function(addAllHAndlers2) {
            console.log('addAllHAndlers2 : ' + addAllHAndlers2);
            addAllHAndlers(sizes, "size-active");
        })
    addAllHAndlers(tools, "tool-active");
    addAllHAndlers(sizes, "size-active");

    function addAllHAndlers(arr, className) {
        for(var item in arr) {
           arr[item].onmousedown = addHandler(arr[item], arr, className); 
        }
    }
    function addHandler(element, arr, className) {
        return function() {
            removeAllClasses(arr);
            element.setAttribute("class", className);
        }
    }
    function removeAllClasses(arr) {
        for(var item in arr) {
            arr[item].removeAttribute("class");
        }
    }
    sizes.small.onclick = function() {
        ctxb.lineWidth = 1;
        eraserSize = 8;
        eraserCursor = "url('images/cursor/eraser.png'), auto";
        pencilCursor = "url('images/cursor/pencil.png'), auto";
        polygonCursor = "url('images/tools/hexagon.png'), auto";
    }

    sizes.middle.onclick = function() {
        ctxb.lineWidth = 5;
        eraserSize = 16;
        eraserCursor = "url('images/cursor/eraser-med.png'), auto";
        pencilCursor = "url('images/cursor/pencil-med.png'), auto";
        polygonCursor = "url('images/tools/hexagon-med.png'), auto";
    }

    sizes.big.onclick = function() {
        ctxb.lineWidth = 15;
        eraserSize = 32;
        eraserCursor = "url('images/cursor/eraser-big.png'), auto";
        pencilCursor = "url('images/cursor/pencil-big.png'), auto";
        polygonCursor = "url('images/tools/hexagon-big.png'), auto";
    }

    var processing = false;
    var operations = [];

    operations['mousedown'] = function() {
        //dragStart
        processing = true;
        ctxb.beginPath();
    };
    operations['mouseup'] = function() {
        //dragStop
        processing = false;
    };
    operations['mousemove'] = function() {
        //drag
    };

    function takeSnapshot() {
        snapshot = ctxb.getImageData(0, 0, canvasFront.width, canvasFront.height);
    }

    function restoreSnapshot() {
        ctxb.putImageData(snapshot, 0, 0);
    }
    function dragStart(event) {
        processing = true;
        dragging = true;
        dragStartLocation = getCanvasCoordinates(event);
        takeSnapshot(); 
    }
    function drag(event) {
        var position;
        if (dragging === true) {
            //restoreSnapshot();
        var position = getCanvasCoordinates(event);

            if(status_rect) {
                drawRect(position);
            }
            if(status_rect_v) {
               drawRect(position);
            }
            if(status_polygon_v) {
               drawPolygon(position, 6, Math.PI / 4);
            }
            if(status_circlee_v) {
               drawCircle(position);
            }
            if(status_circlee) {
                drawCircle(position); 
            }
            if(status_polygon) {
                drawPolygon(position, 6, Math.PI / 4);
            }
        }
    }
    function dragStop(event) {
        processing = false;
        dragging = false;
        //restoreSnapshot();
        var position = getCanvasCoordinates(event);
        if(!status_eraser) {
            if(status_rect_v) {
               drawRect(position);
            }
            if(status_polygon_v) {
               drawPolygon(position, 6, Math.PI / 4);
            }
            if(status_circlee_v) {
               drawCircle(position);  
            }
            if(status_rect) {
                drawRect(position);
            }
            if(status_line) {
                drawLine(position);   
            }
            if(status_circlee) {
                drawCircle(position);
            }
            if(status_polygon) {
                drawPolygon(position, 6, Math.PI / 4);
            }
        } else {

        }
    }
    function getCanvasCoordinates(event) {
        var x = event.clientX - canvasFront.getBoundingClientRect().left,
            y = event.clientY - canvasFront.getBoundingClientRect().top;
        return {x: x, y: y};
    }
    function drawRect(position) {
        var positioning = getCanvasCoordinates(position);
        var points = {
            s: 'rect'
          , x: position.x
          , y: position.y
          , xp: positioning.x
          , yp: positioning.y
          , c: ctxb.strokeStyle
          , id: canvasFront.id
        }
        paint.json.emit('paint points', points);
        positioning = points;

        restoreSnapshot();
        ctxb.beginPath();
        painting(points);
    //    if(status_rect) {
    //        ctxb.fillRect(position.x, position.y, dragStartLocation.x - position.x, dragStartLocation.y - position.y);
    //    }
    //    if(status_rect_v) {
    //        ctxb.strokeRect(position.x, position.y, dragStartLocation.x - position.x, dragStartLocation.y - position.y);
    //    }
    }
    function painting(points) {
        if (canvasFront.id == points.id) {
          ctxb.strokeStyle = points.c;
          ctxb.fillStyle = ctxb.strokeStyle;
          switch (points.s) {
          case 'rect':
            ctxb.beginPath();
            if(status_rect) {
                ctxb.fillRect(points.x, points.y, dragStartLocation.x - points.x, dragStartLocation.y - points.y);
            }
            if(status_rect_v) {
                ctxb.strokeRect(points.x, points.y, dragStartLocation.x - points.x, dragStartLocation.y - points.y);
            }
            break;
          }
        }
      }
    function drawLine(position) {
        restoreSnapshot();
        ctxb.beginPath();
        ctxb.moveTo(dragStartLocation.x, dragStartLocation.y);
        ctxb.lineTo(position.x, position.y);
        ctxb.stroke();
    }
    function drawCircle(position) {
        restoreSnapshot();
        var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
        ctxb.beginPath();
        ctxb.arc(position.x, position.y, radius, 0, 2 * Math.PI, false);
        if(status_circlee) {
            ctxb.fill();   
        }
        if(status_circlee_v) {
            ctxb.stroke(); 
        }
    }
    function drawPolygon(position, sides, angle) {
        restoreSnapshot();
        var coordinates = [],
            radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
            index = 0;

        for (index = 0; index < sides; index++) {
            coordinates.push({x: dragStartLocation.x + radius * Math.cos(angle), y: dragStartLocation.y - radius * Math.sin(angle)});
            angle += (2 * Math.PI) / sides;
        }

        ctxb.beginPath();
        ctxb.moveTo(coordinates[0].x, coordinates[0].y);
        for (index = 1; index < sides; index++) {
            ctxb.lineTo(coordinates[index].x, coordinates[index].y);
        }

        ctxb.closePath();
        if(status_polygon) {
            ctxb.fill();   
        }
        if(status_polygon_v) {
            ctxb.stroke(); 
        }
    }
    tools.circlee_v.onclick = function() {
        status_rect_v = false;
        status_polygon_v = false;
        status_circlee_v = true;
        status_circlee = false;
        status_eraser = false;
        status_pencil = false;
        status_polygon = false;
        status_rect = false;
        status_line = false;
        console.log("circlee_v " + status_circlee_v);
        canvasFront.style.cursor = circleCursor;
       canvasFront.addEventListener("mousedown", dragStart, false);
       canvasFront.addEventListener("mousemove", drag, false);
       canvasFront.addEventListener("mouseup", dragStop, false);
    }
    tools.polygon_v.onclick = function() {
        status_rect_v = false;
        status_polygon_v = true;
        status_circlee_v = false;
        status_circlee = false;
        status_eraser = false;
        status_pencil = false;
        status_polygon = false;
        status_rect = false;
        status_line = false;
         console.log("polygon_v " + status_polygon_v);
        canvasFront.style.cursor = polygonCursor;
       canvasFront.addEventListener("mousedown", dragStart, false);
       canvasFront.addEventListener("mousemove", drag, false);
       canvasFront.addEventListener("mouseup", dragStop, false);
    }
    tools.rect_v.onclick = function() {  
        status_rect_v = true;
        status_polygon_v = false;
        status_circlee_v = false;
        status_circlee = false;
        status_eraser = false;
        status_pencil = false;
        status_polygon = false;
        status_rect = false;
        status_line = false;
        console.log("rect_v " + status_rect_v);
        canvasFront.style.cursor = rectCursor;
       canvasFront.addEventListener("mousedown", dragStart, false);
       canvasFront.addEventListener("mousemove", drag, false);
       canvasFront.addEventListener("mouseup", dragStop, false);
    }
    tools.rect.onclick = function() {
        status_rect_v = false;
        status_polygon_v = false;
        status_circlee_v = false;
        status_eraser = false;
        status_pencil = false;
        status_line = false;
        status_circlee = false;
        status_polygon = false;
        status_rect = true;
        socket.emit('status_rect', status_rect = true);
        socket.on('status_rect', function(status_rect) {
            status_rect = true;
            console.log('status_rect : ' + status_rect);
        })
        console.log("rect " + status_rect);
        canvasFront.style.cursor = rectCursor;
       canvasFront.addEventListener("mousedown", dragStart, false);
       canvasFront.addEventListener("mousemove", drag, false);
       canvasFront.addEventListener("mouseup", dragStop, false);
    };

    tools.polygon.onclick = function() {
        status_rect_v = false;
        status_polygon_v = false;
        status_circlee_v = false;
        status_eraser = false;
        status_pencil = false;
        status_line = false;
        status_circlee = false;
        status_rect = false;
        status_polygon = true;
        socket.emit('status_polygon', status_polygon = true);
        socket.on('status_polygon', function(status_polygon) {
            status_polygon = true;
            console.log('status_polygon : ' + status_polygon);
        })
        console.log("polygon " + status_polygon);
        canvasFront.style.cursor = polygonCursor;
       canvasFront.addEventListener("mousedown", dragStart, false);
       canvasFront.addEventListener("mousemove", drag, false);
       canvasFront.addEventListener("mouseup", dragStop, false);
    };
    tools.circlee.onclick = function() {
        status_rect_v = false;
        status_polygon_v = false;
        status_circlee_v = false;
        status_eraser = false;
        status_pencil = false;
        status_line = false;
        status_polygon = false;
        status_rect = false;
        status_circlee = true;
        socket.emit('status_circlee', status_circlee = true);
        socket.on('status_circlee', function(status_circlee) {
            status_circlee = true;
            console.log('status_circlee : ' + status_circlee);
        })
        console.log("circlee " + status_circlee);
        canvasFront.style.cursor = circleCursor;
       canvasFront.addEventListener("mousedown", dragStart, false);
       canvasFront.addEventListener("mousemove", drag, false);
       canvasFront.addEventListener("mouseup", dragStop, false);
    };
    tools.line.onclick = function() {
        status_rect_v = false;
        status_polygon_v = false;
        status_circlee_v = false;
        status_circlee = false;
        status_eraser = false;
        status_pencil = false;
        status_polygon = false;
        status_rect = false;
        status_line = true;
        socket.emit('status_line', status_line = true);
        socket.on('status_line', function(status_line) {
            status_line = true;
            console.log('status_line : ' + status_line);
        })
        console.log("line " + status_line);
        canvasFront.style.cursor = lineCursor;
       canvasFront.addEventListener("mousedown", dragStart, false);
       canvasFront.addEventListener("mousemove", drag, false);
       canvasFront.addEventListener("mouseup", dragStop, false);
    };

    tools.pencil.onclick = function() {
        status_rect_v = false;
        status_polygon_v = false;
        status_circlee_v = false;
        status_circlee = false;
        status_eraser = false;
        status_line = false;
        status_polygon = false;
        status_rect = false;
        status_pencil = true;
        socket.emit('status_pencil', status_pencil = true);
        socket.on('status_pencil', function(status_pencil) {
            status_pencil = true;
            console.log('status_pencil : ' + status_pencil);
        })
        canvasFront.addEventListener("mousedown", function() {
         operations["mousedown"]();  
        });

        canvasFront.addEventListener("mouseup", function() {
         operations["mouseup"]();   
        });

        canvasFront.addEventListener("mousemove", function() {
         operations["mousemove"]();   
        });

        canvasFront.style.cursor = pencilCursor;
        console.log("pencil " + processing);
        operations['mousemove'] = function() {

           if(processing) {
               console.log("pencil " + processing);
               ctxb.lineTo(mouseX, mouseY);
               ctxb.stroke();
               socket.emit('ctxbb_lineTo', ctxb.lineTo(mouseX, mouseY));
           };
        };
    };

    tools.eraser.onclick = function() {
        status_rect_v = false;
        status_polygon_v = false;
        status_circlee_v = false;
        status_circlee = false;
        status_line = false;
        status_polygon = false;
        status_pencil = false;
        status_rect = false;
        status_eraser = true;
        socket.emit('status_eraser', status_eraser = true);
        socket.on('status_eraser', function(status_eraser) {
            status_eraser = true;
            console.log('status_eraser : ' + status_eraser);
        })
        canvasFront.addEventListener("mousedown", function() {
         operations["mousedown"]();  
        });

        canvasFront.addEventListener("mouseup", function() {
         operations["mouseup"]();   
        });

        canvasFront.addEventListener("mousemove", function() {
         operations["mousemove"]();   
        });
        operations['mousemove'] = function() {
            canvasFront.style.cursor = eraserCursor;
            console.log("eraser " + processing);
           if(processing) {
               console.log("eraser " + processing);
               ctxb.clearRect(mouseX, mouseY, eraserSize, eraserSize);
           };
        };
    };
    color.onchange = function(e) {
        ctxb.strokeStyle = e.srcElement.value;
        ctxb.fillStyle = e.srcElement.value;
    }
    fileImg.onchange = function() {
        var file = fileImg.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            var dataUri = event.target.result;
                img = new Image();
            img.onload = function() {
                ctxf.strokeRect(startX, startY, img.width, img.height);
                ctxf.drawImage(img, startX, startY);

                operations['mousemove'] = function() {
                    if(processing) {
                        canvasFront.width = canvasFront.width;
                        ctxf.strokeRect(mouseX, mouseY, imgWidth.value, imgHeight.value);
                        ctxf.drawImage(img, mouseX, mouseY, imgWidth.value, imgHeight.value);
                    };
                };
                operations['mouseup'] = function() {
                    properties.style.display = 'none';
                    canvasFront.width = canvasFront.width;
                    processing = false;
                    ctxb.drawImage(img, mouseX, mouseY, imgWidth.value, imgHeight.value);
                    operations['mousemove'] = undefined;
                    operations['mouseup'] = function() {
                        processing = false;
                    };
                };
            };  
            img.src = dataUri;
            properties.style.display = 'block';
            imgWidth.value = img.width;
            imgHeight.value = img.height;
        };
        reader.readAsDataURL(file);
    }
    imgWidth.addEventListener("change", changeImgSize);
    imgHeight.addEventListener("change", changeImgSize);

    function changeImgSize() {
        canvasFront.width = canvasFront.width;
        ctxf.strokeRect(startX, startY, imgWidth.value, imgHeight.value);
        ctxf.drawImage(img, startX, startY, imgWidth.value, imgHeight.value)
    }
    invert.onclick = function() {
        var imageData = ctxf.getImageData(startX, startY, imgWidth.value, imgHeight.value);
        for(var i = 0; i < imageData.data.length; i+=4) {
            for(var j = i; j < i + 3; j++) {
                imageData.data[j] = 255 - imageData.data[j];   
            }
        }
        ctxf.putImageData(imageData, startX, startY);
    };
    };
})(jQuery);