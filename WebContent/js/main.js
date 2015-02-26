//主逻辑

//4*4格子数据存数组 设计成二维数组
var board = new Array();
//默认分数0
var score = 0;
//为每个格子设定一个额状态，判断是否已经移动过
var hasConflicted = new Array();
//触屏变量声明，手指开始接触屏幕到离开屏幕坐标
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;


//页面加载完毕后执行
$(document).ready(function(){
    //移动端准备工作
    prepareForMobile();

    //默认启动新游戏
    newGame();
});

//移动端
function prepareForMobile(){

    //屏幕宽度大于500时不做自适应处理，设定为固定大小
    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }

    //棋盘格外边框为设备宽度-2倍格子间距
    $("#grid-container").css('width',gridContainerWidth - 2*cellSpace);
    //高度
    $("#grid-container").css('height',gridContainerWidth - 2*cellSpace);
    //间距
    $("#grid-container").css('padding',cellSpace);
    //边框角度
    $("#grid-container").css('border-radius',0.02*gridContainerWidth);

    //格子属性设置
    $(".grid-cell").css('width',cellSideLength);
    $(".grid-cell").css('height',cellSideLength);
    $(".grid-cell").css('border-radius',0.02*cellSideLength);
}

function newGame() {
    //新游戏设置score=0
    updateScore(0)
    //初始化
    init();
    //随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

//初始化
function init(){
    //没个格子
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css("top",getPosTop(i,j));
            gridCell.css("left",getPosLeft(i,j));
        }
    }

    //初始化二位数组
    for(var i=0;i<4;i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j=0;j<4;j++){
           //每个格子赋值0
           board[i][j]=0;
           hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
    score = 0;
}
function updateBoardView(){
    $(".number-cell").remove();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $("#number-cell-"+i+"-"+j)

            if(board[i][j]==0){
                //当数字是0时不显示
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
            }else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));

                //不同数字的背景色
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                //不同数字的前景色
                theNumberCell.css('color',getNumberColor(board[i][j]));
                //放入数字
                theNumberCell.text(board[i][j]);
            }
            //更新好以后每个格子状态都设成false
            hasConflicted[i][j] = false;
        }
    }
    //字行高
    $(".number-cell").css('line-height',cellSideLength+"px");
    //字号
    $(".number-cell").css('font-size',0.6*cellSideLength+"px");
}

function generateOneNumber(){
    if(nospace(board)){
        return false;
    }
    //随机一个位置
    var x = parseInt(Math.floor(Math.random()*4));
    var y = parseInt(Math.floor(Math.random()*4));


    //如果50次内扔没找到这个随机位置，人工找，设置成死循环越到最后越慢
    var times = 0;
    while(times < 50){
        if(board[x][y]==0){
            break;
        }
        x = parseInt(Math.floor(Math.random()*4));
        y = parseInt(Math.floor(Math.random()*4));

        times++;
    }

    //times > 50 程序找空位置
    if(times > 50){
        for(var i=0;i<4;i++){
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    x = i;
                    y = j;
                }
            }
        }
    }

    //随机产生一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //随机位置显示随机数
    board[x][y] = randNumber;

    //动画显示生成的格子和数字
    showNumberWidthAnimation(x,y,randNumber);

    return true;
}

//按键响应
$(document).keydown(function(event){
        //判断按下按键的kycode
        switch(event.keyCode){
            case 37: //left
                //是否可以向左移动
                if(moveLeft()){
                    //生成新的数字
                    setTimeout("generateOneNumber()",210);
                    //判断当前游戏是否结束
                    setTimeout("isgameover()",300);
                }
                break;
            case 38: //up
                //是否可以向上移动
                if(moveUp()){
                    //生成新的数字
                    setTimeout("generateOneNumber()",210);
                    //判断当前游戏是否结束
                    setTimeout("isgameover()",300);
                }
                break;
            case 39://right
                //是否可以向右移动
                if(moveRight()){
                    //生成新的数字
                    setTimeout("generateOneNumber()",210);
                    //判断当前游戏是否结束
                    setTimeout("isgameover()",300);
                }
                break;
            case 40: //down
                //是否可以向下移动
                if(moveDown()){
                    //生成新的数字
                    setTimeout("generateOneNumber()",210);
                    //判断当前游戏是否结束
                    setTimeout("isgameover()",300);
                }
                break;
            default: // 其他不起作用
                break;
        }
 });

//移动端触屏监听事件 触屏开始
document.addEventListener('touchstart',function(event){
    //event.touches 坐标记录数组
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;

})
//移动端触屏监听事件 触屏结束
document.addEventListener('touchend',function(event){
    endx = event.changedTouches[0].pageX;
    endy= event.changedTouches[0].pageY;

    // x y哪个变化大，向哪个方向移动
    //end - start >0 正方向  <0反方向

    var deltax = endx -startx;
    var deltay = endy -starty;

    //如果仅仅是一次点击的话，会进入这个时间方法，判断在某个范围内为点击事件不执行操作
    if(Math.abs(deltax) <= 0.03*documentWidth && Math.abs(deltay) < 0.03*documentWidth){
        return;
    }

    //x
    if(Math.abs(deltax) >= Math.abs(deltay)){
        //右
        if(deltax > 0){
            if(moveRight()){
                //生成新的数字
                setTimeout("generateOneNumber()",210);
                //判断当前游戏是否结束
                setTimeout("isgameover()",300);
            }
        }
        //左
        else{
            if(moveLeft()){
                //生成新的数字
                setTimeout("generateOneNumber()",210);
                //判断当前游戏是否结束
                setTimeout("isgameover()",300);
            }
        }
    }
    //y
    else{
        //上
        if(deltay < 0){
            if(moveUp()){
                //生成新的数字
                setTimeout("generateOneNumber()",210);
                //判断当前游戏是否结束
                setTimeout("isgameover()",300);
            }
        }
        //下
        else{
            if(moveDown()){
                //生成新的数字
                setTimeout("generateOneNumber()",210);
                //判断当前游戏是否结束
                setTimeout("isgameover()",300);
            }
        }
    }
})

//gameover
function isgameover(){
    if( nospace( board ) && nomove( board ) ){
        gameOver();
    }
};

function gameOver(){
    alert('gameover!');
}

function moveLeft(){

    if(!canMoveLeft(board)){
        return false;
    }
    //move left
    //对每一个数字的左侧位置进行判断，看是否可能为落脚点
    //落脚位置是否为空？
    //落脚位置数字和待判定元素数字相等？
    //移动路径中是否有障碍物？
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            //本身是数字
            if(board[i][j]!=0){
                //遍历本身左边的所有位置
                for(var k=0;k<j;k++){
                    //为空或者没有障碍物的时候可以移动
                    if(board[i][k]==0 && noBlockCross(i,k,j,board)){
                        //move;
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }//和该位置相等并且没有障碍物的时候可以移动
                    else if(board[i][k]==board[i][j] && noBlockCross(i,k,j,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;

                        continue;
                    }

                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }
    //move up
    //对每一个数字的上侧位置进行判断，看是否可能为落脚点
    //落脚位置是否为空？
    //落脚位置数字和待判定元素数字相等？
    //移动路径中是否有障碍物？
    for(var j=0;j<4;j++){
        for(var i=1;i<4;i++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    //为空或者没有障碍物的时候可以移动
                    if(board[k][j]==0 && noBlockVertial(j,k,i,board)){
                        //move;
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    //和该位置相等并且没有障碍物的时候可以移动
                    else if(board[k][j]==board[i][j] && noBlockVertial(j,k,i,board) && !hasConflicted[k][j]){
                        //move
                        showMoveAnimation(i,j,k,j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    //move Right
    //对每一个数字的右侧位置进行判断，看是否可能为落脚点
    //落脚位置是否为空？
    //落脚位置数字和待判定元素数字相等？
    //移动路径中是否有障碍物？
    if(!canMoveRight(board)){
        return false;
    }
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if(board[i][j]!=0){
                for(var k=3;k>j;k--){
                    //为空或者没有障碍物的时候可以移动
                    //和该位置相等并且没有障碍物的时候可以移动
                    if(board[i][k] == 0 && noBlockCross(i,j,k,board)){
                        //move;
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[i][k] == board[i][j] && noBlockCross(i,j,k,board) && !hasConflicted[i][k]){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] =true;

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    //move Down
    //对每一个数字的下侧位置进行判断，看是否可能为落脚点
    //落脚位置是否为空？
    //落脚位置数字和待判定元素数字相等？
    //移动路径中是否有障碍物？
    if(!canMoveDown(board)){
        return false;
    }

    for(var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    //为空或者没有障碍物的时候可以移动
                    //和该位置相等并且没有障碍物的时候可以移动
                    if(board[k][j] == 0 && noBlockVertial(j,i,k,board)){
                        //move;
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }else if(board[k][j] == board[i][j]&& noBlockVertial(j,i,k,board) && !hasConflicted[k][j]){
                        //move;
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}