
var obj = document.getElementById("cusor");
$("#cusor").attr("disabled",true);
function cusorMove(mouseX, mouseY)
{
	mouseX = mouseX-obj.clientWidth/2;
	mouseY = mouseY-obj.clientHeight/2;
    obj.style.left = mouseX+"px";
    obj.style.top = mouseY+"px";
}

function cusorSelected(sel)
{
	obj.innerHTML = sel?"+":"";
}

function cusorSetSize(size){
	if (size < 30) {
		size = 30;
	}
	if (size > 100) {
		size = 100;
	};
	obj.style.width = size+"px";
	obj.style.height = size+"px";
	obj.style.borderRadius = size/2+"px";
	obj.style.lineHeight = size+"px";
	obj.style.fontSize = (size/3)*2+"px";
}

function cusorDisplay(display)
{
	obj.style.display = display;
}

// window.onload=function(){
//     document.body.onmousemove = doit; 
// }