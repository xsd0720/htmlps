var canvas;
var ctx;
var isMouseDown;
var isAltDown;
var drawImagePixelData;
var fontem = parseInt(window.getComputedStyle(document.documentElement, null)["font-size"]);//这是为了不同分辨率上配合@media自动调节刮的宽度
window.onload=function(){

    canvas = document.getElementById("canvas");


    canvas.width=canvas.clientWidth;
    canvas.height=canvas.clientHeight;
    
    ctx = canvas.getContext("2d");
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    //PC端的处理
    canvas.addEventListener("mousemove",eventMove,false);
    canvas.addEventListener("mousedown",eventDown,false);
    canvas.addEventListener("mouseup",eventUp,false);
    canvas.addEventListener("mouseenter",eventEnter,false);
    canvas.addEventListener("mouseleave",eventLeave,false);
    // canvas.addEventListener("onmousewheel", eventWheel, false);
            
    // //移动端的处理
    // canvas.addEventListener('touchstart', eventDown,false);
    // canvas.addEventListener('touchend', eventUp,false);
    // canvas.addEventListener('touchmove', eventMove,false);


    initCanvas();

}


//初始化画布，画灰色的矩形铺满
function initCanvas(){
    //网上的做法是给canvas设置一张背景图片，我这里的做法是直接在canvas下面另外放了个div。
    //c1.style.backgroundImage="url(中奖图片.jpg)";
    // ctx.globalCompositeOperation = "source-over";
    // ctx.fillStyle = '#aaaaaa';
    // ctx.fillRect(0,0,c1.clientWidth,c1.clientHeight);
    // ctx.fill();
    
    // ctx.font = "Bold 30px Arial";
    //         ctx.textAlign = "center";
    //         ctx.fillStyle = "#999999";
    //         ctx.fillText("刮一刮",c1.width/2,50);
    
    //把这个属性设为这个就可以做出圆形橡皮擦的效果
    //有些老的手机自带浏览器不支持destination-out,下面的代码中有修复的方法
    // ctx.globalCompositeOperation = 'destination-out';
    var size = 30;

    ctx.strokeStyle = "red";
    ctx.fillStyle = "red"
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true

    var img=new Image()  
    img.src="img/14.png";  
    img.onload = function () //确保图片已经加载完毕  
    {  
        // ctx.drawImage(img, 0, 0);  
        var w = img.width
        var h = img.height

        ctx.drawImage(img,0,0);

        // Create a circular clipping path 
        ctx.translate(w / 2,  1.5 * h);       
        ctx.beginPath();
        ctx.arc(0,0,100,0,Math.PI*2,true);
        ctx.clip();
        ctx.drawImage(img,-w / 2,-150);
    }

    cusorSetSize(size+2);
}


//鼠标按下 和 触摸开始
function eventDown(event){
    // event.preventDefault();
    if (event.button == 0) {

        var mouseX =event.pageX-this.offsetLeft;
        var mouseY =event.pageY-this.offsetTop;
        
        if (isAltDown) {
            self.drawImagePixelData = ctx.getImageData(mouseX+15, mouseY+15, 30, 30);
            // var imgData = ctx.getImageData(mouseX, mouseY, 1, 1);
            // var red=imgData.data[0];
            // var green=imgData.data[1];
            // var blue=imgData.data[2];
            // var alpha=imgData.data[3];
            // console.log(red);
            // console.log(green);
            // console.log(blue);
            // console.log(alpha);
            // ctx.fillStyle = 'rgb('+red+','+green+',' +blue+')';


            return;
        }
        isMouseDown = true;
        if (self.drawImagePixelData) {
            ctx.putImageData(self.drawImagePixelData, mouseX-15, mouseY-15);
        }
        
        // ctx.beginPath();
        // ctx.lineTo(mouseX, mouseY);
        // ctx.arc(mouseX, mouseY, 15, 0, Math.PI * 2, true);
        
        // // ctx.style.display = 'none';
        // // ctx.offsetHeight;
        // // ctx.style.display = 'inherit'; 
        // ctx.fill();
        // ctx.closePath();
    }
}

//鼠标移动 和 触摸移动
function eventMove(event){

    // event.preventDefault();
    var mouseX =event.pageX-this.offsetLeft;
    var mouseY =event.pageY-this.offsetTop;

    
    if (isMouseDown) {
        //more point
        if (event.changedTouches) 
        {
            event = event.changedTouches[0];
        }
        if (self.drawImagePixelData) {
            ctx.putImageData(self.drawImagePixelData, mouseX-15, mouseY-15);
        }
        
        // ctx.beginPath();
        // ctx.lineTo(mouseX, mouseY);
        // ctx.arc(mouseX, mouseY, 15, 0, Math.PI * 2, true);
        
        // // ctx.style.display = 'none';
        // // ctx.offsetHeight;
        // // ctx.style.display = 'inherit'; 
        // ctx.fill();
        // ctx.closePath();
    }
    
    mouseX = event.clientX;
    mouseY = event.clientY;

    cusorMove(mouseX, mouseY);
}

//鼠标抬起 和 触摸结束
function eventUp(event){
    event.preventDefault();
    
    // //得到canvas的全部数据
    // var a = ctx.getImageData(0,0,c1.width,c1.height);
    // var j=0;
    // for(var i=3;i<a.data.length;i+=4){
    //         if(a.data[i]==0)j++;
    // }

    // //当被刮开的区域等于一半时，则可以开始处理结果
    // if(j>=a.data.length/8){
    //     isOk = 1;
    // }

    if (isAltDown) {
        return;
    }
    isMouseDown = false;
    ctx.save();
    

    
    // alert(a)
    // setTimeout(function(){alert(1);ctx.restore();}, 2000);
}

function saveFile(data, filename){
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;
   
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};

function saveAsLocalImage () {  
    var myCanvas = document.getElementById("canvas");  
    // here is the most important part because if you dont replace you will get a DOM 18 exception.  
    var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");  
    // var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");   
    window.location.href=image; // it will save locally  


} 

function saveImageInfo(){
    var mycanvas = document.getElementById("canvas");  
    var image    = mycanvas.toDataURL("image/png");  
    var w=window.open('about:blank','image from canvas');  
    w.document.write("<img src='"+image+"' alt='from canvas'/>"); 
}


function eventWheel(event){
    console.log(event)
}

function eventEnter(event)
{
    cusorDisplay("block");
}

function eventLeave(event)
{
    eventUp(event);
    cusorDisplay("none");
    
}

//计算颜色值的反色，colorStr格式为：rgb(0,0,0),#000000或者#f00
function reversalColor(colorStr){
    var sixNumReg = /^#(\d{2})(\d{2})(\d{2})$/ig;
    var threeNumReg = /^#(\d{1})(\d{1})(\d{1})$/ig;
    var rgbReg = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/ig;
    var c1=0, c2=0, c3=0;
    var parseHexToInt = function(hex){
        return parseInt(hex,16);
    };     
    var parseIntToHex = function(int){
        return int.toString(16);
    };
    this.parse = function(){
        if(sixNumReg.test(colorStr)){
            sixNumReg.exec(colorStr);
            c1 = parseHexToInt(RegExp.$1);
            c2 = parseHexToInt(RegExp.$2);
            c3 = parseHexToInt(RegExp.$3);
        } else if(threeNumReg.test(colorStr)){
            threeNumReg.exec(colorStr);
            c1 = parseHexToInt(RegExp.$1+RegExp.$1);
            c2 = parseHexToInt(RegExp.$2+RegExp.$2);
            c3 = parseHexToInt(RegExp.$3+RegExp.$3);
        } else if(rgbReg.test(colorStr)){
            //rgb color 直接就是十进制，不用转换
            rgbReg.exec(colorStr);
            c1 = RegExp.$1;
            c2 = RegExp.$2;
            c3 = RegExp.$3;
        } else {
            throw new Error("Error color string format. eg.[rgb(0,0,0),#000000,#f00]");
        }
        c1 = parseIntToHex(255 - c1);
        c2 = parseIntToHex(255 - c2);
        c3 = parseIntToHex(255 - c3);   
        console.log(c1);    
        console.log(c2); 
        console.log(c3);    
        // return '#' + (c1<10?'0'+c1:c1) + (c2<10?'0'+c2:c2) + (c3<10?'0'+c3:c3);
    };
}

document.onkeydown = function(event){

    if (event.altKey) {
        isAltDown = true;
        cusorSelected(true);
    }
}
document.onkeyup = function(event){

    if (event.keyIdentifier == "Alt") 
    {
        isAltDown = false;
        cusorSelected(false);
    }
}

$("#download").click(function(){
    saveAsLocalImage();
})

