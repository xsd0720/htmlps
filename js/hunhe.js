// 指定要使用的处理器，这里暂时不指定  
var processor = "";  
// 所有的处理器都在这个对象下  
var pixProcessor = {};  
  
var imgBackground = new Image();  
var imgButterfly = new Image();  
imgBackground.onload = imgButterfly.onload = function () {  
    this.loaded = true;  
    if (imgBackground.loaded && imgButterfly.loaded) {  
        process();  
    }  
};  
imgBackground.src = "background.jpg";  
imgButterfly.src = "butterfly.png";  
  
var canvas = document.createElement("canvas");  
canvas.width = 610;  
canvas.height = 502;  
var context = canvas.getContext("2d"); 


var pixProcessor = {
	normal: function(){
        /// <summary>正常模式</summary>  
  
        var alpha = butterfly.alpha;  
        return {  
            red: butterfly.red * alpha + background.red * (1 - alpha),  
            green: butterfly.green * alpha + background.green * (1 - alpha),  
            blue: butterfly.blue * alpha + background.blue * (1 - alpha),  
            alpha: butterfly.alpha * alpha + background.alpha * (1 - alpha)  
        } 
	},
	dissolve: function(){
        /// <summary>溶解</summary>  
  
        // 正式用判断条件  
        //if (Math.floor(Math.random() * 100) > (butterfly.alpha / 255 * 100)) {  
  
        // 测试用判断条件  
        if (Math.floor(Math.random() * 100) > 50) {  
            return background;  
        } else {  
            return butterfly;  
        } 

	},
	darken: function(){
        return {  
            red: Math.min(background.red, butterfly.red),  
            green: Math.min(background.green, butterfly.green),  
            blue: Math.min(background.blue, butterfly.blue),  
            alpha: Math.min(background.alpha, butterfly.alpha)  
        }
	},
	multiply: function(){
        /// <summary>正片叠底</summary>  
  
        return {  
            red: butterfly.red * background.red / 255,  
            green: butterfly.green * background.green / 255,  
            blue: butterfly.blue * background.blue / 255,  
            alpha: butterfly.alpha * background.alpha / 255  
        };
	},
	colorBurn: function(){
        return {  
            red: Math.max(0, background.red + butterfly.red - 255) * 255 / butterfly.red,  
            green: Math.max(0, background.green + butterfly.green - 255) * 255 / butterfly.green,  
            blue: Math.max(0, background.blue + butterfly.blue - 255) * 255 / butterfly.blue,  
            alpha: Math.max(0, background.alpha + butterfly.alpha - 255) * 255 / butterfly.alpha  
        };
	},

}


function process() {  
    // 计算蝴蝶图片相对背景图片的中心位置  
    var centerX = (imgBackground.width - imgButterfly.width) / 2;  
    var centerY = (imgBackground.height - imgButterfly.height) / 2;  
  
    // 绘制背景图  
    context.drawImage(imgBackground, 0, 0);  
    // 通过getImageData函数获取背景图片中，蝴蝶图片所应该在的区域的像素数据  
    var backgroundData = context.getImageData(centerX, centerY, imgButterfly.width, imgButterfly.height);  
    // 缓存ImageData中的data数组，这才是我们要操作的东西  
    var backgroundPixs = backgroundData.data;  
  
    // 清空一次画布  
    context.clearRect(0, 0, canvas.width, canvas.height);  
  
    // 绘制蝴蝶图  
    context.drawImage(imgButterfly, centerX, centerY);  
    // 不解释  
    var butterflyData = context.getImageData(centerX, centerY, imgButterfly.width, imgButterfly.height);  
    // 不解释  
    var butterflyPixs = butterflyData.data;  
  
    // 再次绘制背景图  
    context.drawImage(imgBackground, 0, 0);  
    // 再次绘制蝴蝶图（反正这句话也没什么卵用，忘了当时为啥要写这句话了）  
    context.drawImage(imgButterfly, centerX, centerY);  
  
    // 若没有定义处理器则不进行处理  
    if (typeof processor != "undefined") {  
        var newPix;  
        for (var i = 0; i < backgroundPixs.length; i += 4) {  
            // 跳过全透明像素  
            if (butterflyPixs[i + 3] == 0) continue;  
  
            // 传入两个图像对应的像素进行处理  
            newPix = pixProcesser[processor]({ red: backgroundPixs[i], green: backgroundPixs[i + 1], blue: backgroundPixs[i + 2], alpha: backgroundPixs[i + 3] },  
                                             { red: butterflyPixs[i], green: butterflyPixs[i + 1], blue: butterflyPixs[i + 2], alpha: butterflyPixs[i + 3] });  
  
            if (newPix) {  
                // 将处理好的像素赋值给背景图ImageData（实际上你传给蝴蝶图也没问题，只是下面putImageData的时候需要指向蝴蝶图罢了）  
                backgroundPixs[i] = newPix.red;  
                backgroundPixs[i + 1] = newPix.green;  
                backgroundPixs[i + 2] = newPix.blue;  
            }  
        }  
  
        // 好的，将处理结果交给浏览器  
        context.putImageData(backgroundData, centerX, centerY);  
    }  
    if (document.body) {  
        document.appendChild(canvas);  
    } else {  
        window.addEventListener("load", function () {  
            document.appendChild(canvas);  
        }, false);  
    }  
}  


/**
pixProcesser.linearBurn: function (background, butterfly) {  
        /// <summary>线性加深</summary>  
  
        return {  
            red: Math.max(0, background.red + butterfly.red - 255),  
            green: Math.max(0, background.green + butterfly.green - 255),  
            blue: Math.max(0, background.blue + butterfly.blue - 255),  
            alpha: Math.max(0, background.alpha + butterfly.alpha - 255)  
        };  
    };  

7.深色，processor需要指定为 darkerColor

[javascript] view plain copy
pixProcesser.darkerColor: function (background, butterfly) {  
        /// <summary>深色</summary>  
  
        if ((background.red + background.green + background.blue + background.alpha) < (butterfly.red + butterfly.green + butterfly.blue + butterfly.alpha)) {  
            return background;  
        } else {  
            return butterfly;  
        }  
    };  

8.变亮，processor需要指定为 lighten

[javascript] view plain copy
pixProcesser.lighten: function (background, butterfly) {  
        /// <summary>变亮</summary>  
  
        return {  
            red: Math.max(background.red, butterfly.red),  
            green: Math.max(background.green, butterfly.green),  
            blue: Math.max(background.blue, butterfly.blue),  
            alpha: Math.max(background.alpha, butterfly.alpha)  
        };  
    };  

9.滤色，processor需要指定为 screen

[javascript] view plain copy
pixProcesser.screen: function (background, butterfly) {  
        /// <summary>滤色</summary>  
  
        return {  
            red: 255 - (255 - butterfly.red) * (255 - background.red) / 255,  
            green: 255 - (255 - butterfly.green) * (255 - background.green) / 255,  
            blue: 255 - (255 - butterfly.blue) * (255 - background.blue) / 255,  
            alpha: 255 - (255 - butterfly.alpha) * (255 - background.alpha) / 255  
        };  
    };  

10.颜色减淡，processor需要指定为 colorDodge

[javascript] view plain copy
pixProcesser.colorDodge: function (background, butterfly) {  
        /// <summary>颜色减淡</summary>  
  
        return {  
            red: background.red + butterfly.red * background.red / (255 - butterfly.red),  
            green: background.green + butterfly.green * background.green / (255 - butterfly.green),  
            blue: background.blue + butterfly.blue * background.blue / (255 - butterfly.blue),  
            alpha: background.alpha + butterfly.alpha * background.alpha / (255 - butterfly.alpha)  
        };  
    };  

11.线性减淡，processor需要指定为 linearDodge

[javascript] view plain copy
pixProcesser.linearDodge: function (background, butterfly) {  
        /// <summary>线性减淡</summary>  
  
        return {  
            red: Math.min(background.red + butterfly.red, 255),  
            green: Math.min(background.green + butterfly.green, 255),  
            blue: Math.min(background.blue + butterfly.blue, 255),  
            alpha: Math.min(background.alpha + butterfly.alpha, 255)  
        };  
    };  

12.浅色，processor需要指定为 lighterColor

[javascript] view plain copy
pixProcesser.lighterColor: function (background, butterfly) {  
        /// <summary>浅色</summary>  
  
        if ((background.red + background.green + background.blue + background.alpha) > (butterfly.red + butterfly.green + butterfly.blue + butterfly.alpha)) {  
            return background;  
        } else {  
            return butterfly;  
        }  
    };  

13.叠加，processor需要指定为 overlay

[javascript] view plain copy
pixProcesser.overlay: function (background, butterfly) {  
        /// <summary>叠加</summary>  
  
        return {  
            red: 255 - (255 - butterfly.red) * (255 - background.red) / 128,  
            green: 255 - (255 - butterfly.green) * (255 - background.green) / 128,  
            blue: 255 - (255 - butterfly.blue) * (255 - background.blue) / 128,  
            alpha: 255 - (255 - butterfly.alpha) * (255 - background.alpha) / 128  
        };  
    };  

14.柔光，processor需要指定为 softLight

[javascript] view plain copy
pixProcesser.softLight: function (background, butterfly) {  
        /// <summary>柔光</summary>  
  
        return {  
            red: background.red + (2 * butterfly.red - 255) * (Math.sqrt(background.red / 255) * 255 - background.red) / 255,  
            green: background.green + (2 * butterfly.green - 255) * (Math.sqrt(background.green / 255) * 255 - background.green) / 255,  
            blue: background.blue + (2 * butterfly.blue - 255) * (Math.sqrt(background.blue / 255) * 255 - background.blue) / 255,  
            alpha: background.alpha + (2 * butterfly.alpha - 255) * (Math.sqrt(background.alpha / 255) * 255 - background.alpha) / 255  
        };  
    };  

15.强光，processor需要指定为 hardLight

[javascript] view plain copy
pixProcesser.hardLight: function (background, butterfly) {  
        /// <summary>强光</summary>  
  
        return {  
            red: butterfly.red > 128 ? 255 - (255 - butterfly.red) * (255 - background.red) / 128 : butterfly.red * background.red / 128,  
            green: butterfly.green > 128 ? 255 - (255 - butterfly.green) * (255 - background.green) / 128 : butterfly.green * background.green / 128,  
            blue: butterfly.blue > 128 ? 255 - (255 - butterfly.blue) * (255 - background.blue) / 128 : butterfly.blue * background.blue / 128,  
            alpha: butterfly.alpha > 128 ? 255 - (255 - butterfly.alpha) * (255 - background.alpha) / 128 : butterfly.alpha * background.alpha / 128  
        };  
    };  

16.亮光，processor需要指定为 vividLight

[javascript] view plain copy
pixProcesser.vividLight: function (background, butterfly) {  
        /// <summary>亮光</summary>  
  
        return {  
            red: butterfly.red <= 128 ? 255 - (255 - background.red) / (2 * butterfly.red) * 255 : background.red / (2 * (255 - butterfly.red)) * 255,  
            green: butterfly.green <= 128 ? 255 - (255 - background.green) / (2 * butterfly.green) * 255 : background.green / (2 * (255 - butterfly.green)) * 255,  
            blue: butterfly.blue <= 128 ? 255 - (255 - background.blue) / (2 * butterfly.blue) * 255 : background.blue / (2 * (255 - butterfly.blue)) * 255,  
            alpha: butterfly.alpha <= 128 ? 255 - (255 - background.alpha) / (2 * butterfly.alpha) * 255 : background.alpha / (2 * (255 - butterfly.alpha)) * 255  
        };  
    };  

17.线性光，processor需要指定为 linearLight

[javascript] view plain copy
pixProcesser.linearLight: function (background, butterfly) {  
        /// <summary>线性光</summary>  
  
        return {  
            red: Math.min(2 * butterfly.red + background.red - 255, 255),  
            green: Math.min(2 * butterfly.green + background.green - 255, 255),  
            blue: Math.min(2 * butterfly.blue + background.blue - 255, 255),  
            alpha: Math.min(2 * butterfly.alpha + background.alpha - 255, 255)  
        };  
    };  

18.点光，processor需要指定为 pinLight

[javascript] view plain copy
pixProcesser.pinLight: function (background, butterfly) {  
        /// <summary>点光</summary>  
  
        if (typeof pixProcesser.pinLightProcess == "undefined") {  
            pixProcesser.pinLightProcess = function (sourceColor, blendColor) {  
                return blendColor <= 128 ? Math.min(sourceColor, 2 * blendColor) : Math.max(sourceColor, 2 * blendColor - 255);  
            };  
        }  
  
        return {  
            red: pixProcesser.pinLightProcess(background.red, butterfly.red),  
            green: pixProcesser.pinLightProcess(background.green, butterfly.green),  
            blue: pixProcesser.pinLightProcess(background.blue, butterfly.blue),  
            alpha: pixProcesser.pinLightProcess(background.alpha, butterfly.alpha)  
        };  
    };  

19.实色混合，processor需要指定为 hardMix

[javascript] view plain copy
pixProcesser.hardMix: function (background, butterfly) {  
        /// <summary>实色混合</summary>  
  
        return {  
            red: (background.red + butterfly.red) < 255 ? 0 : 255,  
            green: (background.green + butterfly.green) < 255 ? 0 : 255,  
            blue: (background.blue + butterfly.blue) < 255 ? 0 : 255,  
            alpha: (background.alpha + butterfly.alpha) < 255 ? 0 : 255  
        };  
    };  

20.差值，processor需要指定为 difference

[javascript] view plain copy
pixProcesser.difference: function (background, butterfly) {  
        /// <summary>差值</summary>  
  
        return {  
            red: Math.abs(butterfly.red - background.red),  
            green: Math.abs(butterfly.green - background.green),  
            blue: Math.abs(butterfly.blue - background.blue),  
            alpha: Math.abs(butterfly.alpha - background.alpha),  
        };  
    };  

21.排除，processor需要指定为 exclusion

[javascript] view plain copy
pixProcesser.exclusion: function (background, butterfly) {  
        /// <summary>排除</summary>  
  
        return {  
            red: (butterfly.red + background.red) - butterfly.red * background.red / 128,  
            green: (butterfly.green + background.green) - butterfly.green * background.green / 128,  
            blue: (butterfly.blue + background.blue) - butterfly.blue * background.blue / 128,  
            alpha: (butterfly.alpha + background.alpha) - butterfly.alpha * background.alpha / 128  
        };  
    };  

22.减去，processor需要指定为 subtract

[javascript] view plain copy
pixProcesser.subtract: function (background, butterfly) {  
        /// <summary>减去</summary>  
  
        return {  
            red: Math.max(0, background.red - butterfly.red),  
            green: Math.max(0, background.green - butterfly.green),  
            blue: Math.max(0, background.blue - butterfly.blue),  
            alpha: Math.max(0, background.alpha - butterfly.alpha)  
        };  
    };  

23.划分，processor需要指定为 divide

[javascript] view plain copy
pixProcesser.divide: function (background, butterfly) {  
        /// <summary>划分</summary>  
  
        return {  
            red: (background.red / butterfly.red) * 255,  
            green: (background.green / butterfly.green) * 255,  
            blue: (background.blue / butterfly.blue) * 255,  
            alpha: (background.alpha / butterfly.alpha) * 255,  
        };  
    };  

**/
