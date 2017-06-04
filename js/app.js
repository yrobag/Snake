$(document).ready(function () {

    window.play = false;
    window.velocity = 50;
    window.points = 0

    createTable();

    createSnake();

    $('body').keydown(function (e) {
        var keyCode = e.keyCode;
        if (keyCode == 32 || window.play == true) {
            switch (true) {
                case (keyCode == 32):
                    startStop();
                    break;
                case (keyCode == 37 && window.destination != 1):
                    window.destination = 3;
                    break;
                case (keyCode == 38 && window.destination != 2):
                    window.destination = 4;
                    break;
                case (keyCode == 39 && window.destination != 3):
                    window.destination = 1;
                    break;
                case (keyCode == 40 && window.destination != 4):
                    window.destination = 2;
                    break;
            }
        }
    });


});


function createTable() {
    var table = '<span id="score">Score:<span id="points">'+ window.points +'</span></span><table>';
    for (var i = 0; i < 50; i++) {
        table += '<tr>';
        for (var j = 0; j < 50; j++) {
            table += '<td id="' + i + 'x' + j + '"></td>';
        }
        table += '</tr>';
    }
    table += '</table>';
    $('body').append(table);
}

function createSnake() {
    var i = Math.floor((Math.random() * 40) + 5);
    var j = Math.floor((Math.random() * 40) + 5);

    $('#' + i + 'x' + j).addClass('head').attr('data-number', 0);

    window.destination = selectDestination(i, j);
    createTail(i, j);

    createNewBlock()


}


function selectDestination(i, j) {
    i = parseInt(i);
    j = parseInt(j);

    while (true) {
        var rndDest = Math.floor((Math.random() * 100));
        switch (true) {
            case (rndDest >= 75 && j - 2 >= 0):
                return 1;
                break;
            case (rndDest < 75 && rndDest >= 50 && i - 2 >= 0):
                return 2;
                break;
            case (rndDest < 50 && rndDest >= 25 && j + 2 < 100):
                return 3;
                break;
            case (rndDest < 25 && i + 2 < 100):
                return 4;
                break;
        }

    }
}

function createTail(i, j) {
    i = parseInt(i);
    j = parseInt(j);

    switch (window.destination) {
        case 1:
            $('#' + i + 'x' + (j - 1)).addClass('tail').attr('data-number', 1);
            $('#' + i + 'x' + (j - 2)).addClass('tail').attr('data-number', 2);
            break;
        case 2:
            $('#' + (i - 1) + 'x' + j).addClass('tail').attr('data-number', 1);
            $('#' + (i - 2) + 'x' + j).addClass('tail').attr('data-number', 2);
            break;
        case 3:
            $('#' + i + 'x' + (j + 1)).addClass('tail').attr('data-number', 1);
            $('#' + i + 'x' + (j + 2)).addClass('tail').attr('data-number', 2);
            break;
        case 4:
            $('#' + (i + 1) + 'x' + j).addClass('tail').attr('data-number', 1);
            $('#' + (i + 2) + 'x' + j).addClass('tail').attr('data-number', 2);
            break;
    }
    window.tailLength = 2;
}

function startStop() {
    if (!window.play) {
        window.play = true;
        runWorld = setInterval(function () {
            oneStep();
        }, window.velocity);
    } else if(window.play === true)  {
        window.play = false;
        clearInterval(runWorld);
    }
}

function oneStep() {
    var headParams = getHead();
    switch (window.destination) {
        case 1:
            headParams[1] += 1;
            break;
        case 2:
            headParams[0] += 1;
            break;
        case 3:
            headParams[1] -= 1;
            break;
        case 4:
            headParams[0] -= 1;
            break;
    }
    var head = $('#' + headParams[0] + 'x' + headParams[1]);

    if (head.hasClass('tail') || !head.is('td')){
        clearInterval(runWorld);
        window.play = 'game over';
        alert('Game Over! Your score is ' + window.points + '. Refresh to play again');
    }
    if(head.hasClass('new')){
        head.removeClass('new');
        window.addNew = true
    }
    head.addClass('head').attr('data-number', 0);


    moveTail();
    if (!window.isNew) {
        createNewBlock();
    }
}

function getHead() {
    var head = $("table").find('[data-number="' + 0 + '"]');
    var id = head.attr('id');
    var i = parseInt(id.substring(0, id.indexOf('x')));
    var j = parseInt(id.substring(id.indexOf('x') + 1));

    head.removeClass('head').attr('data-number', -1);

    return [i, j];
}

function moveTail() {
    for (var k = 1; k < window.tailLength; k++) {
        var previous = $("table").find('[data-number="' + k + '"]');
        var next = $("table").find('[data-number="' + -1 + '"]');
        previous.attr('data-number', -1);
        next.addClass('tail').attr('data-number', k);
    }
    var next = $("table").find('[data-number="' + -1 + '"]');
    var previous = $("table").find('[data-number="' + window.tailLength + '"]');
    next.addClass('tail').attr('data-number', window.tailLength);
    previous.removeClass('tail').removeAttr('data-number');

    if(window.addNew){
        window.tailLength +=1;
        previous.addClass('tail').attr('data-number', window.tailLength);
        window.addNew = false;
        window.isNew = false;
        // window.points +=1
        $('#points').text(++window.points);
    }
}

function createNewBlock() {
    while (true) {
        var i = Math.floor((Math.random() * 50));
        var j = Math.floor((Math.random() * 50));

        var newBlock = $('#'+i+'x'+j);
        if (!newBlock.hasClass()){
            newBlock.addClass('new');
            window.isNew = true;
            break;
        }
    }
}

