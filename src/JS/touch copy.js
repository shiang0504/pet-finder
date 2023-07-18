//判斷手機使用者手勢
let startX =''
let startY =''
let endX =''
let endY =''

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
            console.log('向左滑')
            callback('left')
        }else{
            console.log('向右滑')
            callback('right')
        }
    }
    if (Math.abs(startX-endX)<Math.abs(startY-endY)){
        if(startY-endY > 0 ){
            console.log('向上滑')
            callback('up')
        }else{
            console.log('向下滑')
            callback('down')
        }
    }
}

export { startX, startY, endX, endY, touchstartHandler, touchendHandler}