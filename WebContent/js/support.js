//支撑逻辑

//获取设备屏幕宽度
documentWidth = window.screen.availWidth;
//设备宽度100% 棋盘格宽度92%
gridContainerWidth = 0.92*documentWidth;
//每一个小格子18%
cellSideLength = 0.18*documentWidth;
//格子之间的间距
cellSpace = 0.04*documentWidth;

function getPosTop(i,j){
    return cellSpace + i*(cellSpace+cellSideLength);
}
function getPosLeft(i,j){
    return cellSpace + j*(cellSpace+cellSideLength);
}

function getNumberBackgroundColor(number){
    switch(number){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67e5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }
    return "black";
}

function getNumberColor(number){
    if(number==2||number==4){
        return "#776e65"
    }else{
        return "white";
    }
}

function nospace(board){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]==0){
                return false;
            }
        }
    }
    return true;
}

function canMoveLeft(board){
    //左边是否没数字？
    //左边数字是否和自己相等？
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            //本身是不为零的数字
            if(board[i][j] !=0){
                 //左边是0或者和自己相等，可以移动
                 if(board[i][j-1]==0|| board[i][j-1]==board[i][j]){
                       return true;
                 }
            }
        }
    }
    return false;
}

function canMoveUp(board){
    //上面是否有数字？
    //上面数字是否和自己相等
    for(var j=0;j<4;j++){
        for(var i=1;i<4;i++){
            //本身是不为零的数字
            if(board[i][j]!=0){
                if(board[i-1][j]==0||board[i-1][j]==board[i][j]){
                    return true;
                }
            }
        }
    }

    return false;
}

function canMoveRight(board){
    //右面是否有数字
    //右面数字是否和自己相等
    for(var i=0;i<4;i++){
        for(var j=2; j>=0; j--){
            if(board[i][j]!=0){
                if(board[i][j+1]==0 || board[i][j+1]== board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board){
    //下方是否有数字
    //下方数字是否与自己相等
    for(var j=0;j<4;j++){
        for(var i=2;i>=0;i--){
            if(board[i][j]!=0){
                if(board[i+1][j]==0 || board[i+1][j] == board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockCross(row,col1,coll2,board){
    //与左边一列之间数字为0
    for(var i = col1+1;i<coll2;i++){
        //存在不等于0的元素
        if(board[row][i]!=0){
            return false;
        }
    }
    return true;
}

function noBlockVertial(col,row1,row2,board) {
    //与上面一行之间数字为0
    for(var i=row1+1;i<row2 ;i++){
        //存在不等于0的元素
        if(board[i][col]!=0){
            return false;
        }
    }
    return true;
}

function nomove( board ){
    if( canMoveLeft( board ) ||
        canMoveRight( board ) ||
        canMoveUp( board ) ||
        canMoveDown( board ) )
        return false;

    return true;
}

