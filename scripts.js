"use strict";

let canvas;

window.onload = function()
{
    canvas = new Canvas("canvas");

    changeTool("ellipse", "btn7");
    changeColor("#000000");

    document.getElementById("brush-radius").value = canvas.BrushRadius;
    document.getElementById("spray-radius").value = canvas.SprayRadius;
    document.getElementById("width").value = canvas.Width;
    document.getElementById("height").value = canvas.Height;
}

function changeTool(tool, id)
{
    canvas.switchTool(tool);

    let btns = document.querySelectorAll(".button");
    for (let b of btns)
    {
        b.classList.remove("button_hover");
    }

    document.getElementById(id).classList.add("button_hover");
}

function changeColor(clr)
{
    document.getElementById("current-color").style.backgroundColor = clr;

    let r = parseInt(clr[1] + clr[2], 16);
    let g = parseInt(clr[3] + clr[4], 16);
    let b = parseInt(clr[5] + clr[6], 16);

    canvas.switchColor(new Color(r, g, b));
}

function changeBrushRadius(value)
{
    if (value.length > 0)
    {
        canvas.BrushRadius = value;
        document.getElementById("brush-radius").value = canvas.BrushRadius;
    }
}

function changeSprayRadius(value)
{
    if (value.length > 0)
    {
        canvas.SprayRadius = value;
        document.getElementById("spray-radius").value = canvas.SprayRadius;
    }
}

function tryParseInt(str, defaultValue) 
{
    let retValue = defaultValue;
    if (str !== null) 
    {
        if (str.length > 0) 
        {
            if (!isNaN(str)) 
            {
                 retValue = parseInt(str);
            }
        }
     }

     return retValue;
}

function tryParseFloat(str, defaultValue) 
{
    let retValue = defaultValue;
    if (str !== null) 
    {
        if (str.length > 0) 
        {
            if (!isNaN(str)) 
            {
                 retValue = parseFloat(str);
            }
        }
     }

     return retValue;
}

let previousState = 0;
let currentState = 0;

function selectColor()
{
    previousState = currentState;

    switch (this.selectedIndex)
    {
        case 0: //rgb
            document.getElementById("name-of-param1").innerHTML = "R";
            document.getElementById("name-of-param2").innerHTML = "G";
            document.getElementById("name-of-param3").innerHTML = "B";
            document.getElementById("name-of-param4").style.visibility = "hidden";

            document.getElementById("restriction1").innerHTML = "[0; 255]";
            document.getElementById("restriction2").innerHTML = "[0; 255]";
            document.getElementById("restriction3").innerHTML = "[0; 255]";
            document.getElementById("restriction4").style.visibility = "hidden";

            document.getElementById("param4").style.visibility = "hidden";

            currentState = 0;
            break;

        case 1: //hsv
            document.getElementById("name-of-param1").innerHTML = "H";
            document.getElementById("name-of-param2").innerHTML = "S";
            document.getElementById("name-of-param3").innerHTML = "V";
            document.getElementById("name-of-param4").style.visibility = "hidden";

            document.getElementById("restriction1").innerHTML = "[0; 360]";
            document.getElementById("restriction2").innerHTML = "[0; 100]";
            document.getElementById("restriction3").innerHTML = "[0; 100]";
            document.getElementById("restriction4").style.visibility = "hidden";

            document.getElementById("param4").style.visibility = "hidden";

            currentState = 1;
            break;    

        case 2: //cmy
            document.getElementById("name-of-param1").innerHTML = "C";
            document.getElementById("name-of-param2").innerHTML = "M";
            document.getElementById("name-of-param3").innerHTML = "Y";
            document.getElementById("name-of-param4").style.visibility = "hidden";

            document.getElementById("restriction1").innerHTML = "[0; 100]";
            document.getElementById("restriction2").innerHTML = "[0; 100]";
            document.getElementById("restriction3").innerHTML = "[0; 100]";
            document.getElementById("restriction4").style.visibility = "hidden";

            document.getElementById("param4").style.visibility = "hidden";

            currentState = 2;
            break;    

        case 3: //cmyk
            document.getElementById("name-of-param1").innerHTML = "C";
            document.getElementById("name-of-param2").innerHTML = "M";
            document.getElementById("name-of-param3").innerHTML = "Y";
            document.getElementById("name-of-param4").innerHTML = "K";

            document.getElementById("restriction1").innerHTML = "[0; 100]";
            document.getElementById("restriction2").innerHTML = "[0; 100]";
            document.getElementById("restriction3").innerHTML = "[0; 100]";
            document.getElementById("restriction4").innerHTML = "[0; 100]";

            document.getElementById("name-of-param4").style.visibility = "visible";
            document.getElementById("restriction4").style.visibility = "visible";
            document.getElementById("param4").style.visibility = "visible";

            currentState = 3;
            break;    
    }

    let r, g, b;
    let h, s, v;
    let c, m, y, k;
    let color;

    switch (previousState)
    {
        case 0: //rgb
            switch (currentState)
            {
                case 0: //rgb
                    break;

                case 1: //hsv
                    r = tryParseInt(document.getElementById("param1").value, 0);
                    g = tryParseInt(document.getElementById("param2").value, 0);
                    b = tryParseInt(document.getElementById("param3").value, 0);

                    color = ColorConverter.RgbToHsv(r, g, b);

                    document.getElementById("param1").value = color.h;
                    document.getElementById("param2").value = color.s;
                    document.getElementById("param3").value = color.v;
                    break;

                case 2: //cmy
                    r = tryParseInt(document.getElementById("param1").value, 0);
                    g = tryParseInt(document.getElementById("param2").value, 0);
                    b = tryParseInt(document.getElementById("param3").value, 0);

                    color = ColorConverter.RgbToCmy(r, g, b);

                    document.getElementById("param1").value = color.c;
                    document.getElementById("param2").value = color.m;
                    document.getElementById("param3").value = color.y;
                    break;

                case 3: //cmyk
                    r = tryParseInt(document.getElementById("param1").value, 0);
                    g = tryParseInt(document.getElementById("param2").value, 0);
                    b = tryParseInt(document.getElementById("param3").value, 0);

                    color = ColorConverter.RgbToCmyk(r, g, b);

                    document.getElementById("param1").value = color.c;
                    document.getElementById("param2").value = color.m;
                    document.getElementById("param3").value = color.y;
                    document.getElementById("param4").value = color.y;
                    break;
            }
            break;

        case 1: //hsv
            switch (currentState)
            {
                case 0: //rgb
                    h = tryParseInt(document.getElementById("param1").value, 0);
                    s = tryParseInt(document.getElementById("param2").value, 0);
                    v = tryParseInt(document.getElementById("param3").value, 0);

                    color = ColorConverter.HsvToRgb(h, s, v);

                    document.getElementById("param1").value = color.r;
                    document.getElementById("param2").value = color.g;
                    document.getElementById("param3").value = color.b;
                    break;

                case 1: //hsv
                    break;

                case 2: //cmy
                    h = tryParseInt(document.getElementById("param1").value, 0);
                    s = tryParseInt(document.getElementById("param2").value, 0);
                    v = tryParseInt(document.getElementById("param3").value, 0);

                    color = ColorConverter.HsvToRgb(h, s, v);
                    color = ColorConverter.RgbToCmy(color.r, color.g, color.b);

                    document.getElementById("param1").value = color.c;
                    document.getElementById("param2").value = color.m;
                    document.getElementById("param3").value = color.y;
                    break;

                case 3: //cmyk
                    h = tryParseInt(document.getElementById("param1").value, 0);
                    s = tryParseInt(document.getElementById("param2").value, 0);
                    v = tryParseInt(document.getElementById("param3").value, 0);

                    color = ColorConverter.HsvToRgb(h, s, v);
                    color = ColorConverter.RgbToCmyk(color.r, color.g, color.b);

                    document.getElementById("param1").value = color.c;
                    document.getElementById("param2").value = color.m;
                    document.getElementById("param3").value = color.y;
                    document.getElementById("param4").value = color.k;
                    break;
            }
            break;    

        case 2: //cmy
            switch (currentState)
            {
                case 0: //rgb
                    c = tryParseInt(document.getElementById("param1").value, 0);
                    m = tryParseInt(document.getElementById("param2").value, 0);
                    y = tryParseInt(document.getElementById("param3").value, 0);

                    color = ColorConverter.CmyToRgb(c, m, y);

                    document.getElementById("param1").value = color.r;
                    document.getElementById("param2").value = color.g;
                    document.getElementById("param3").value = color.b;
                    break;

                case 1: //hsv
                    c = tryParseInt(document.getElementById("param1").value, 0);
                    m = tryParseInt(document.getElementById("param2").value, 0);
                    y = tryParseInt(document.getElementById("param3").value, 0);

                    color = ColorConverter.CmyToRgb(c, m, y);
                    color = ColorConverter.RgbToHsv(color.r, color.g, color.b);

                    document.getElementById("param1").value = color.h;
                    document.getElementById("param2").value = color.s;
                    document.getElementById("param3").value = color.v;
                    break;

                case 2: //cmy
                    break;

                case 3: //cmyk
                    c = tryParseInt(document.getElementById("param1").value, 0);
                    m = tryParseInt(document.getElementById("param2").value, 0);
                    y = tryParseInt(document.getElementById("param3").value, 0);

                    color = ColorConverter.CmyToCmyk(c, m, y);            

                    document.getElementById("param1").value = color.c;
                    document.getElementById("param2").value = color.m;
                    document.getElementById("param3").value = color.y;
                    document.getElementById("param4").value = color.k;
                    break;
            }
            break;    

        case 3: //cmyk
            switch (currentState)
            {
                case 0: //rgb
                    c = tryParseInt(document.getElementById("param1").value, 0);
                    m = tryParseInt(document.getElementById("param2").value, 0);
                    y = tryParseInt(document.getElementById("param3").value, 0);
                    k = tryParseInt(document.getElementById("param4").value, 0);

                    color = ColorConverter.CmykToRgb(c, m, y, k);

                    document.getElementById("param1").value = color.r;
                    document.getElementById("param2").value = color.g;
                    document.getElementById("param3").value = color.b;
                    break;

                case 1: //hsv
                    c = tryParseInt(document.getElementById("param1").value, 0);
                    m = tryParseInt(document.getElementById("param2").value, 0);
                    y = tryParseInt(document.getElementById("param3").value, 0);
                    k = tryParseInt(document.getElementById("param4").value, 0);

                    color = ColorConverter.CmykToRgb(c, m, y, k);
                    color = ColorConverter.RgbToHsv(color.r, color.g, color.b);

                    document.getElementById("param1").value = color.h;
                    document.getElementById("param2").value = color.s;
                    document.getElementById("param3").value = color.v;
                    break;

                case 2: //cmy
                    c = tryParseInt(document.getElementById("param1").value, 0);
                    m = tryParseInt(document.getElementById("param2").value, 0);
                    y = tryParseInt(document.getElementById("param3").value, 0);
                    k = tryParseInt(document.getElementById("param4").value, 0);

                    color = ColorConverter.CmykToCmy(c, m, y, k);            

                    document.getElementById("param1").value = color.c;
                    document.getElementById("param2").value = color.m;
                    document.getElementById("param3").value = color.y;
                    break;

                case 3: //cmyk
                    break;
            }
            break;    
    }
}

let paletteColorChanged = false;

function makeColor()
{
    let p1, p2, p3, p4;
    let color;

    switch (currentState)
    {
        case 0: //rgb
            p1 = ColorConverter.clamp(tryParseInt(document.getElementById("param1").value, 0), 0, 255);
            p2 = ColorConverter.clamp(tryParseInt(document.getElementById("param2").value, 0), 0, 255);
            p3 = ColorConverter.clamp(tryParseInt(document.getElementById("param3").value, 0), 0, 255);

            p1 = p1.toString(16).length < 2 ? "0" + p1.toString(16) : p1.toString(16);
            p2 = p2.toString(16).length < 2 ? "0" + p2.toString(16) : p2.toString(16);
            p3 = p3.toString(16).length < 2 ? "0" + p3.toString(16) : p3.toString(16);

            document.getElementById("palette-color").style.backgroundColor = "#" + p1 + p2 + p3;
            paletteColorChanged = true;
            break;

        case 1: //hsv    
            p1 = ColorConverter.clamp(tryParseInt(document.getElementById("param1").value, 0), 0, 360);
            p2 = ColorConverter.clamp(tryParseInt(document.getElementById("param2").value, 0), 0, 100);
            p3 = ColorConverter.clamp(tryParseInt(document.getElementById("param3").value, 0), 0, 100);

            color = ColorConverter.HsvToRgb(p1, p2, p3);

            p1 = color.r.toString(16).length < 2 ? "0" + color.r.toString(16) : color.r.toString(16);
            p2 = color.g.toString(16).length < 2 ? "0" + color.g.toString(16) : color.g.toString(16);
            p3 = color.b.toString(16).length < 2 ? "0" + color.b.toString(16) : color.b.toString(16);

            document.getElementById("palette-color").style.backgroundColor = "#" + p1 + p2 + p3;
            paletteColorChanged = true;
            break;

        case 2: //cmy
            p1 = ColorConverter.clamp(tryParseInt(document.getElementById("param1").value, 0), 0, 100);
            p2 = ColorConverter.clamp(tryParseInt(document.getElementById("param2").value, 0), 0, 100);
            p3 = ColorConverter.clamp(tryParseInt(document.getElementById("param3").value, 0), 0, 100);

            color = ColorConverter.CmyToRgb(p1, p2, p3);

            p1 = color.r.toString(16).length < 2 ? "0" + color.r.toString(16) : color.r.toString(16);
            p2 = color.g.toString(16).length < 2 ? "0" + color.g.toString(16) : color.g.toString(16);
            p3 = color.b.toString(16).length < 2 ? "0" + color.b.toString(16) : color.b.toString(16);

            document.getElementById("palette-color").style.backgroundColor = "#" + p1 + p2 + p3;
            paletteColorChanged = true;
            break;

        case 3: //cmyk
            p1 = ColorConverter.clamp(tryParseInt(document.getElementById("param1").value, 0), 0, 100);
            p2 = ColorConverter.clamp(tryParseInt(document.getElementById("param2").value, 0), 0, 100);
            p3 = ColorConverter.clamp(tryParseInt(document.getElementById("param3").value, 0), 0, 100);
            p4 = ColorConverter.clamp(tryParseInt(document.getElementById("param4").value, 0), 0, 100);

            color = ColorConverter.CmykToRgb(p1, p2, p3, p4);

            p1 = color.r.toString(16).length < 2 ? "0" + color.r.toString(16) : color.r.toString(16);
            p2 = color.g.toString(16).length < 2 ? "0" + color.g.toString(16) : color.g.toString(16);
            p3 = color.b.toString(16).length < 2 ? "0" + color.b.toString(16) : color.b.toString(16);

            document.getElementById("palette-color").style.backgroundColor = "#" + p1 + p2 + p3;
            paletteColorChanged = true;
            break;    
    }
}

function rgb2hex(rgb) 
{
    if (/^#[0-9A-F]{6}$/i.test(rgb)) 
    {
        return rgb;
    }

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) 
    {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function changeColorFromPalette()
{
    if (paletteColorChanged)
    {
        let newColor = rgb2hex(document.getElementById("palette-color").style.backgroundColor);
        changeColor(newColor);
    }
    else
    {
        alert("Color is not created yet!");
    }
}

function affineTransform()
{
    function isInside(imgData, x, y)
    {
        return (x >= 0 && x < imgData.width && y >= 0 && y < imgData.height);
    }

    function degreesToRadians(theta)
    {
        return theta*Math.PI/180.0;
    }

    function getPixel(imgData, x, y)
    {
        let index = (x * 4) + (y * imgData.width * 4);

        let r = imgData.data[index];
        let g = imgData.data[index + 1];
        let b = imgData.data[index + 2];

        return new Color(r, g, b);
    }

    function setPixel(imgData, x, y, color)
    {
        let index = (x * 4) + (y * imgData.width * 4);

        imgData.data[index] = color.R;
        imgData.data[index + 1] = color.G;
        imgData.data[index + 2] = color.B;
        imgData.data[index + 3] = 255; //alpha
    }
    
    function drawPoint(imgData, x, y, color)
    {
        if (isInside(imgData, x, y))
        {
            setPixel(imgData, x, y, color);
        }
    }

    let data = canvas.getCanvas();

    let width = data.width;
    let height = data.height;

    let rotation = Matrix.identity(3);
    let stretch = Matrix.identity(3);
    let offset = Matrix.identity(3);

    let angle = tryParseFloat(document.getElementById("rotation").value, 0);
    
    let t1 = -Math.tan(degreesToRadians(angle/2.0));
    let t2 = Math.sin(degreesToRadians(angle));
    
    let shear1 = Matrix.identity(3);
    let shear2 = Matrix.identity(3);
    let shear3 = Matrix.identity(3);
    
    shear1.setData(0, 1, t1);
    shear3.setData(0, 1, t1);
    shear2.setData(1, 0, t2);
    
    rotation = (shear1.multiplyMatrix(shear2)).multiplyMatrix(shear3);

    let stretchx = Math.abs(tryParseFloat(document.getElementById("stretchx").value, 1));
    let stretchy = Math.abs(tryParseFloat(document.getElementById("stretchy").value, 1));

    stretch.setData(0, 0, stretchx);
    stretch.setData(1, 1, stretchy);

    let offsetx = tryParseFloat(document.getElementById("offsetx").value, 0);
    let offsety = tryParseFloat(document.getElementById("offsety").value, 0);

    offset.setData(0, 2, offsetx);
    offset.setData(1, 2, offsety);

    //console.log("angle: " + angle + ", stretchx: " + stretchx + ", stretchy: " + stretchy + ", offsetx: " + offsetx + ", offsety: " + offsety);

    let transform = (rotation.multiplyMatrix(stretch)).multiplyMatrix(offset);

    //console.log(transform);
    
    let temp = canvas.getCanvas();
    temp.data.fill(255);

    for (let i = 0; i < data.width; i++)
    {
        for (let j = 0; j < data.height; j++)
        {
            let oldPoint = new Matrix(3, 1);

            oldPoint.setData(0, 0, i);
            oldPoint.setData(1, 0, j);
            oldPoint.setData(2, 0, 1);

            let newPoint = transform.multiplyMatrix(oldPoint);

            newPoint.setData(0, 0, Math.round(newPoint.getData(0, 0)));
            newPoint.setData(1, 0, Math.round(newPoint.getData(1, 0)));

            let c = getPixel(data, i, j);
            drawPoint(temp, newPoint.getData(0, 0), newPoint.getData(1, 0), c);

            drawPoint(temp, newPoint.getData(0, 0)+1, newPoint.getData(1, 0)+1, c);
            drawPoint(temp, newPoint.getData(0, 0)-1, newPoint.getData(1, 0)+1, c);
            drawPoint(temp, newPoint.getData(0, 0)+1, newPoint.getData(1, 0)-1, c);
            drawPoint(temp, newPoint.getData(0, 0)-1, newPoint.getData(1, 0)-1, c);
        }
    }

    canvas.setCanvas(temp);
}

function resizeCanvas()
{
    function isInside(imgData, x, y)
    {
        return (x >= 0 && x < imgData.width && y >= 0 && y < imgData.height);
    }

    function getPixel(imgData, x, y)
    {
        let index = (x * 4) + (y * imgData.width * 4);

        let r = imgData.data[index];
        let g = imgData.data[index + 1];
        let b = imgData.data[index + 2];

        return new Color(r, g, b);
    }

    function setPixel(imgData, x, y, color)
    {
        let index = (x * 4) + (y * imgData.width * 4);

        imgData.data[index] = color.R;
        imgData.data[index + 1] = color.G;
        imgData.data[index + 2] = color.B;
        imgData.data[index + 3] = 255; //alpha
    }

    let width = Math.abs(tryParseInt(document.getElementById("width").value, null));
    let height = Math.abs(tryParseInt(document.getElementById("height").value, null));

    if (width == null || height == null)
    {
        alert("You have entered invalid width or/and height");
        return;
    }

    let data = canvas.getCanvas();

    document.getElementById("canvas").width = width;
    document.getElementById("canvas").height = height;

    let cnvs = document.getElementById("canvas");
    let ctx = cnvs.getContext("2d");
    let temp = ctx.getImageData(0, 0, cnvs.width, cnvs.height);
    temp.data.fill(255);

    for (let i = 0; i < temp.width; i++)
    {
        for (let j = 0; j < temp.height; j++)
        {
            if (isInside(data, i, j))
            {
                setPixel(temp, i, j, getPixel(data, i, j));
            }
        }
    }

    canvas.setCanvas(temp);
}