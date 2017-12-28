var container;
var width;
var height;
var app = false;
var colors;
var scoreEl;
var timeEl;
var ticker = false;
$( document ).ready(function() {
    $.arcticmodal('setDefault', {
    closeOnEsc: false,
    closeOnOverlayClick: false,
    afterClose: function(data, el) {
        $('#play').show();
        $('#stopGame').show();
    }
});
    $('#menuModal').arcticmodal();
     container = document.getElementById('container');
     width = container.offsetWidth - 30; //получаем ширину экрана
     height = window.innerHeight - $('#scoreContainer').height(); // получаем высоту экрана
     colors = [0xFFFF0B, 0xFF700B, 0x4286f4, 0x4286f4, 0xf441e8, 0x8dff6d, 0x41ccc9, 0xe03375, 0x95e032, 0x77c687, 0x43ba5b, 0x0ea3ba]; //массив цветов, 0x вместо #
     scoreEl = document.getElementById('score');
     timeEl = document.getElementById('time');


    $('body').on('click', '#play',function(){
        $('#menuModal').arcticmodal('close');
         $('#stopGame').show();
         $('#play').hide();
        ticker.start();
    });

    $('#menu').click(function(){
        $('#menuModal').arcticmodal();
        if(ticker)
            ticker.stop();
    });
    
     $('body').on('click', '#stopGame',function(){
        $('#menuModal').arcticmodal();
        if(ticker) {
            $('#stopGame').hide();
            app.ticker.stop();
            model.gameOver();
        }
    });
    
    $('body').on('click', '#newGame',function(){
        $('#menuModal').arcticmodal('close');
        if(app){
            
            while(app.stage.children[0]) 
            { app.stage.removeChild(app.stage.children[0]); }
            stat = defaultStat;
            app.ticker.start();
            model.drawScore();
        } else {
        view.loadGame();
    }
    });
});
var model = {
    gameOver: function() {
        var style = new PIXI.TextStyle({ //стили для текста
            fill: '0xffffff',
            fontSize: '6vw',
        }); 
        $('#stopGame').hide();
         $('#play').hide();
        var gameOverText = new PIXI.Text('Game Over', style); //собственно выводимый текст
        gameOverText.x = width / 2; //центрируем относительно экрана
        gameOverText.y = height / 2; //центрируем относительно экрана
        gameOverText.pivot.x = 50; //выравниваем по оси х
        gameOverText.pivot.y = 50; // выравниваем по оси y
        app.stage.addChild(gameOverText); //выводим на холсте
},
    createCanvas: function() {
        if(!app){
            app = new PIXI.Application(width, height); //создаем холст
            container.appendChild(app.view); //выводим его в тело страницы
        }

    },
    drawCircle: function() {
        
        rand = Math.floor(Math.random() * colors.length); //генерим рандомное число (в промежутке от 0 до количества цветов в массиве цветов)
        var radius = 12; //радиус круга
        var inAreaX = width; //возможные координаты по оси X, которые может занимать круг, ширина страницы минус его диаметр
        var inAreaY = height;
        var circleY = Math.floor(Math.random()* ( (inAreaY-15) - 15)+15);
        var circleX = Math.floor(Math.random()* ( (inAreaX-15) - 15)+15); //создаем круг в рандомном месте по оси X
        var circle = new PIXI.Graphics(); //создаем новый графический элемент
        circle.lineStyle(0); //начинаем рисовать
        circle.beginFill(colors[rand], 1); //задаем рандомный цвет
        circle.drawCircle(circleX, circleY, radius); //рисуем кружок, ведь он наш дружок
        circle.endFill(); //закончили отрисовку
        circle.interactive = true; //делаем круг интерактивным
        circle.buttonMode = true; //меняем курсор при наведении
        app.stage.addChild(circle); //выводим круг на холсте
        circle.on('pointerdown', controller.clearFigure); //добавляем возможность при клике на фигуру удалить её
        stat.setCircles += 1;
        stat.circleIds.push(circle);
        
    },
    
    drawScore: function() {
        console.log("score"+stat.score);
        timeEl.innerHTML = Math.floor(stat.time);
        scoreEl.innerHTML = Math.floor(stat.score);
    }
}         
var view = {
    chance:0.015,
    timing:1,
    loadGame: function() {
        model.createCanvas();
        model.drawScore();
        ticker = app.ticker.add(delta => gameLoop(delta));
    },
}
var defaultStat = {
    score : 0,
    time:10,
    setCircles : 0,
    unsetCircles : 0,
    circleIds : [],
    
}
var stat = {
    score : 0,
    time:10,
    setCircles : 0,
    unsetCircles : 0,
    circleIds : [],
    
}
var timing = 0;
function gameLoop(delta){
    timing +=  0.014;
    if(Math.random() <  view.chance){
        model.drawCircle();
    }
    if(timing > 1) {
        timing = 0;
        circles = stat.setCircles - stat.unsetCircles;
        stat.time -= Math.floor(circles);
        model.drawScore();    
        
        if(stat.time < 0){
            stat.time = 0;
            model.drawScore();
            app.ticker.stop();
            model.gameOver();
            controller.clearListener();
        }
    }
}


var controller = {
	clearFigure: function(){
            this.clear(); //удаляем фигуры по которой кликнули
            stat.time += 10; stat.score +=10;model.drawScore();view.chance +=0.00002;stat.unsetCircles+=1;
	},
        clearListener: function(){
            stat.circleIds.forEach(function(circle,i){
                circle.off('pointerdown', controller.clearFigure);
            })
        }
}

