//判斷手機使用者手勢
let startX =''
let startY =''
let endX =''
let endY =''
let moveToX =''
let moveToY =''

const touchstartHandler=(event)=>{
    startX = event.touches[0].clientX
    startY = event.touches[0].clientY
}
const touchendHandler=(callback, event)=>{
    endX = event.changedTouches[0].clientX
    endY = event.changedTouches[0].clientY
    if (Math.abs(Math.abs(startX-endX)-Math.abs(startY-endY)) < 100){
        console.log('滑動距離過短(無效)')
        return
    }
    if (Math.abs(startX-endX)>Math.abs(startY-endY)){
        if(startX-endX > 0 ){
            // console.log('向左滑')
            callback('left')
        }else{
            // console.log('向右滑')
            callback('right')
        }
    }
    if (Math.abs(startX-endX)<Math.abs(startY-endY)){
        if(startY-endY > 0 ){
            // console.log('向上滑')
            callback('up')
        }else{
            // console.log('向下滑')
            callback('down')
        }
    }
}

const touchmoveHandler=(callback, event)=>{
    moveToX = event.changedTouches[0].clientX
    moveToY = event.changedTouches[0].clientY
    // console.log('moveToX',moveToX)
    // console.log('moveToY',moveToY)
    let moveDistanceX = moveToX-startX
    let moveDistanceY = moveToY-startY
    callback(moveDistanceX,moveDistanceY)
    if (Math.abs(startX-moveToX)>Math.abs(startY-moveToY)){
        if(startX-moveToX > 0 ){
            console.log('向左滑動了', moveDistanceX)
        }else{
            console.log('向右滑動了', moveDistanceX)
        }
    }
    if (Math.abs(startX-moveToX)<Math.abs(startY-moveToY)){
        if(startY-moveToY > 0 ){
            console.log('向上滑動了', moveDistanceY)
        }else{
            console.log('向下滑動了', moveDistanceY)
        }
    }
}

export { startX, startY, endX, endY, moveToX, moveToY, touchstartHandler, touchendHandler, touchmoveHandler}