"use strict";

class Point
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    get X()
    {
        return this.x;
    }

    set X(value)
    {
        this.x = value;
    }

    get Y()
    {
        return this.y;
    }

    set Y(value)
    {
        this.y = value;
    }
}

class Vector2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    get X()
    {
        return this.x;
    }

    set X(value)
    {
        this.x = value;
    }

    get Y()
    {
        return this.y;
    }

    set Y(value)
    {
        this.y = value;
    }
    
    length()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    static vectorFromPoints(x1, y1, x2, y2)
    {
        return new Vector2(x2 - x1, y2 - y1);
    }

    static interpolate(from, to, amount)
    {
        return (1.0 - amount) * from + amount * to;
    }

    static lerp(start, end, amount)
    {
        let x = this.interpolate(start.X, end.X, amount);
        let y = this.interpolate(start.Y, end.Y, amount);

        return new Vector2(x, y);
    }
}

class Color
{
    constructor(r, g, b)
    {
        this.r = (r < 0) ? 0 : ((r > 255) ? 255 : r);
        this.g = (g < 0) ? 0 : ((g > 255) ? 255 : g);
        this.b = (b < 0) ? 0 : ((b > 255) ? 255 : b);

        this.r = Math.round(this.r);
        this.g = Math.round(this.g);
        this.b = Math.round(this.b);
    }

    get R()
    {
        return this.r;
    }

    set R(value)
    {
        this.r = (value < 0) ? 0 : ((value > 255) ? 255 : value);
        this.r = Math.round(this.r);
    }

    get G()
    {
        return this.g;
    }

    set G(value)
    {
        this.g = (value < 0) ? 0 : ((value > 255) ? 255 : value);
        this.g = Math.round(this.g);
    }

    get B()
    {
        return this.b;
    }

    set B(value)
    {
        this.b = (value < 0) ? 0 : ((value > 255) ? 255 : value);
        this.b = Math.round(this.b);
    }

    toString()
    {
        let result_r = this.r.toString(16).length < 2 ? "0" + this.r.toString(16) : this.r.toString(16);
        let result_g = this.g.toString(16).length < 2 ? "0" + this.g.toString(16) : this.g.toString(16);
        let result_b = this.b.toString(16).length < 2 ? "0" + this.b.toString(16) : this.b.toString(16);

        return ("#" + result_r + result_g + result_b);
    }

    equals(other)
    {
        return ((this.r == other.R) && (this.g == other.G) && (this.b == other.B));
    }
}

class ColorConverter
{
    static clamp(num, min, max)
    {
        return ((num < min) ? min : ((num > max) ? max : num));
    }

    static compare(x, y)
    {
        return (Math.abs(x - y) <= 1e-5 * Math.max(1.0, Math.max(Math.abs(x), Math.abs(y))));
    }

    static RgbToHsv(r, g, b)
    {
        let red = this.clamp(r, 0, 255);
        let green = this.clamp(g, 0, 255);
        let blue = this.clamp(b, 0, 255);
            
        let hue = 0;
        let saturation;
            
        let min = Math.min(Math.min(red, green), blue);
        let value = Math.max(Math.max(red, green), blue);
            
        let delta = value - min;
            
        if (this.compare(value, 0.0))
        {
            saturation = 0;
        }
        else
        {
            saturation = delta / value;
        }
            
        if (this.compare(saturation, 0.0))
        {
            hue = 0.0;
        }
        else
        {
            if (this.compare(red, value))
            {
                hue = (green - blue) / delta;
            }
            else if (this.compare(green, value))
            {
                hue = 2 + (blue - red) / delta;
            }
            else if (this.compare(blue, value))
            {
                hue = 4 + (red - green) / delta;
            }
            
            hue *= 60;
            if (hue < 0.0)
            {
                hue += 360;
            }
        }

        return {h : Math.round(hue), s : Math.round(saturation * 100), v : Math.round(value * (100.0 / 255.0))};
    }

    static RgbToCmy(r, g, b)
    {
        let cyan = 1.0 - (this.clamp(r, 0, 255) / 255.0);
        let magenta = 1.0 - (this.clamp(g, 0, 255) / 255.0);
        let yellow = 1.0 - (this.clamp(b, 0, 255) / 255.0);
            
        return {c : Math.round(cyan * 100), m : Math.round(magenta * 100), y : Math.round(yellow * 100)};
    }

    static RgbToCmyk(r, g, b)
    {
        let red = this.clamp(r, 0, 255) / 255.0;
        let green = this.clamp(g, 0, 255) / 255.0;
        let blue = this.clamp(b, 0, 255) / 255.0;
            
        let key = Math.min(1.0 - red, Math.min(1.0 - green, 1.0 - blue));
        let cyan = (1.0 - red - key)/(1.0 - key);
        let magenta = (1.0 - green - key)/(1.0 - key);
        let yellow = (1.0 - blue - key)/(1.0 - key);
            
        cyan = Math.round(cyan * 100);
        magenta = Math.round(magenta * 100);
        yellow = Math.round(yellow * 100);
        key = Math.round(key * 100);
            
        return {c : cyan, m : magenta, y : yellow, k : key};
    }

    static HsvToRgb(h, s, v)
    {
        let hue = this.clamp(h, 0, 360) / 360.0;
        let saturation = this.clamp(s, 0, 100) / 100.0;
        let value = this.clamp(v, 0, 100) / 100.0;
            
        if (this.compare(s, 0.0))
        {
            return {r : Math.round(value * 255), g : Math.round(value * 255), b : Math.round(value * 255)};
        }
            
        let hi = hue * 6.0;
        if (this.compare(hi, 6.0))
        {
            hi = 0.0;
        }
            
        let i = Math.round(hi);
            
        let var_1 = value * (1.0 - saturation);
        let var_2 = value * (1.0 - saturation * (hi - i));
        let var_3 = value * (1.0 - saturation * (1.0 - (hi - i)));
            
        switch (i)
        {
            case (0):
                return {r : Math.round(value * 255), g : Math.round(var_3 * 255), b : Math.round(var_1 * 255)};
                                
            case (1):
                return {r : Math.round(var_2 * 255), g : Math.round(value * 255), b : Math.round(var_1 * 255)};
                                
            case (2):
                return {r : Math.round(var_1 * 255), g : Math.round(value * 255), b : Math.round(var_3 * 255)};
                                
            case (3):
                return {r : Math.round(var_1 * 255), g : Math.round(var_2 * 255), b : Math.round(value * 255)};
                                
            case (4):
                return {r : Math.round(var_3 * 255), g : Math.round(var_1 * 255), b : Math.round(value * 255)};
                                
            default:
                return {r : Math.round(value * 255), g : Math.round(var_1 * 255), b : Math.round(var_2 * 255)};                
        }
    }

    static CmyToRgb(c, m, y)
    {
        let red = (1.0 - this.clamp(c, 0, 100) / 100.0);
        let green = (1.0 - this.clamp(m, 0, 100) / 100.0);
        let blue = (1.0 - this.clamp(y, 0, 100) / 100.0);
            
        return {r : Math.round(red * 255), g : Math.round(green * 255), b : Math.round(blue * 255)};
    }

    static CmyToCmyk(c, m, y)
    {
        let cyan = this.clamp(c, 0, 100) / 100.0;
        let magenta = this.clamp(m, 0, 100) / 100.0;
        let yellow = this.clamp(y, 0, 100) / 100.0;
            
        let key = Math.min(cyan, Math.min(magenta, yellow));
            
        if (this.compare(key, 1.0))
        {
            cyan = 0;
            magenta = 0;
            yellow = 0;
        }
        else
        {
            cyan = (cyan - key) / (1.0 - key);
            magenta = (magenta - key) / (1.0 - key);
            yellow = (yellow - key) / (1.0 - key);
        }
            
        return {c : Math.round(cyan * 100), m : Math.round(magenta * 100), y : Math.round(yellow * 100), k : Math.round(key * 100)};
    }

    static CmykToRgb(c, m, y, k)
    {
        let cyan = this.clamp(c, 0, 100) / 100.0;
        let magenta = this.clamp(m, 0, 100) / 100.0;
        let yellow = this.clamp(y, 0, 100) / 100.0;
        let key = this.clamp(k, 0, 100) / 100.0;
            
        let red = Math.round(255 * (1.0 - cyan) * (1.0 - key));
        let green = Math.round(255 * (1.0 - magenta) * (1.0 - key));
        let blue = Math.round(255 * (1.0 - yellow) * (1.0 - key));

        return {r : red, g : green, b : blue};
    }

    static CmykToCmy(c, m, y, k)
    {
        let cyan = this.clamp(c, 0, 100) / 100.0;
        let magenta = this.clamp(m, 0, 100) / 100.0;
        let yellow = this.clamp(y, 0, 100) / 100.0;
        let key = this.clamp(k, 0, 100) / 100.0;
            
        cyan = cyan * (1.0 - key) + key;
        magenta = magenta * (1.0 - key) + key;
        yellow = yellow * (1.0 - key) + key;
            
        return {c : Math.round(cyan * 100), m : Math.round(magenta * 100), y : Math.round(yellow * 100)};
    }
}

class Random
{
    static next(min, max) 
    {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    static nextDouble()
    {
        return Math.random();
    }
}

class Matrix
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;

        this.data = Array(x).fill(0);
        for (let i = 0; i < x; i++) 
        {
            this.data[i] = Array(y).fill(0);
        }
    }

    get X()
    {
        return this.x;
    }

    get Y()
    {
        return this.y;
    }

    getData(a, b)
    {
        return this.data[a][b];
    }

    setData(a, b, value)
    {
        this.data[a][b] = value;
    }

    addData(a, b, value)
    {
        this.data[a][b] += value;
    }

    addMatrix(matrix)
    {
        if ((this.X != matrix.X) || (this.Y != matrix.Y))
        {
            throw new Error("Illegal matrix dimensions at addition");
        }

        let t = new Matrix(this.X, this.Y);

        for (let i = 0; i < t.X; i++) 
        {
            for (let j = 0; j < t.Y; j++) 
            {
                let a = this.getData(i, j);
                let b = matrix.getData(i, j);
                t.setData(i, j, a+b);    
            }
        }
        
        return t;
    }

    substractMatrix(matrix)
    {
        if ((this.X != matrix.X) || (this.Y != matrix.Y))
        {
            throw new Error("Illegal matrix dimensions at substraction");
        }

        let t = new Matrix(this.X, this.Y);

        for (let i = 0; i < t.X; i++) 
        {
            for (let j = 0; j < t.Y; j++) 
            {
                let a = this.getData(i, j);
                let b = matrix.getData(i, j);
                t.setData(i, j, a-b);    
            }
        }
        
        return t;
    }

    multiplyMatrix(matrix)
    {
        if (this.Y != matrix.X)
        {
            throw new Error("Illegal matrix dimensions at multiplication");
        }

        let t = new Matrix(this.X, matrix.Y);

        for (let i = 0; i < this.X; i++) 
        {
            for (let j = 0; j < matrix.Y; j++) 
            {
                for (let k = 0; k < this.Y; k++) 
                {
                    t.addData(i, j, this.getData(i, k) * matrix.getData(k, j));
                }
            }
        }
            
        return t;
    }

    multiplyScalar(float)
    {
        let t = new Matrix(this.X, this.Y);

        for (let i = 0; i < this.X; i++) 
        {
            for (let j = 0; j < this.Y; j++) 
            {
                t.setData(i, j, this.getData(i, j) * float);
            }
        }

        return t;
    }

    static identity(n)
    {
        let t = new Matrix(n, n);
        for (let i = 0; i < n; i++)
        {
            t.setData(i, i, 1);
        }
   
        return t;
    }
}

"use strict";

class Timer
{
    constructor(interval, callback)
    {
        this.interval = interval;
        this.callback = callback;
        this.isRunning = false;
        this.timerId = null;
    }

    get Interval()
    {
        return this.interval;
    }

    set Interval(value)
    {
        this.interval = value;
    }

    get Callback()
    {
        return this.callback;
    }

    set Callback(value)
    {
        this.callback = value == null ? this.callback : value;
    }

    start()
    {
        if (!this.isRunning && this.callback != null)
        {
            this.isRunning = true;
            this.timerId = setInterval(this.callback, this.interval);
        }
    }

    stop()
    {
        if (this.timerId != null)
        {
            clearTimeout(this.timerId);
        }

        this.isRunning = false;
    }

    restart()
    {
        this.stop();
        this.start();
    }
}