

/* glue code */
type Font = [number, string];
class Gfx {
    private ctx: CanvasRenderingContext2D;
    private offscreenCtx: CanvasRenderingContext2D
    public width: number = 296;
    public height: number = 128;
    public fontSize: number = 10;

    constructor(canvas: HTMLCanvasElement, width = 296, height = 128) {

        let offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
        this.offscreenCtx = offscreenCanvas.getContext("2d");


        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;

        canvas.height = this.height;
        canvas.width = this.width;
        canvas.style.height = this.height + "px";
        canvas.style.width = this.width + "px";
    }

    public drawString(x: number, y: number, text) {
        this.offscreenCtx.fillText(text, x, y + this.fontSize - 1)
    }

    public fillRect(x1: number, y1: number, width: number, height: number) {
        this.offscreenCtx.fillRect(x1, y1, width, height)
    }

    public drawRect(x1: number, y1: number, width: number, height: number) {
        this.offscreenCtx.strokeRect(x1, y1, width, height);
    }

    public setColor(color: string) {
        this.offscreenCtx.fillStyle = color;
        this.offscreenCtx.strokeStyle = color
    }

    public setFont(font: Font) {
        this.offscreenCtx.font = font[0] + "px " + font[1];
        this.fontSize = font[0];
    }

    public setTextAlignment(alignment: "center" | "left" | "right") {
        this.offscreenCtx.textAlign = alignment;
    }

    public drawLine(x1: number, y1: number, x2: number, y2: number) {
        this.offscreenCtx.beginPath();
        this.offscreenCtx.moveTo(x1, y1);
        this.offscreenCtx.lineTo(x2, y2);
        this.offscreenCtx.stroke();
    }

    public commit() {
        this.ctx.drawImage(this.offscreenCtx.canvas, 0, 0);
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public setPixel(x, y) {
        this.offscreenCtx.fillRect(x, y, 1, 1);
    }

    public fillBuffer(color: string) {
        let old_color = this.offscreenCtx.fillStyle;
        this.offscreenCtx.fillStyle = color;
        this.offscreenCtx.fillRect(0, 0, this.width, this.height);
        this.offscreenCtx.fillStyle = old_color;
    }
}


/* Mocking example
 * Based on the arduino code of the following project:
 * https://github.com/cxandy/AZSMZ-EPAPER/blob/master/weatherstation/weatherstation.ino
 * */



let gfx = new Gfx(document.getElementById("canvas") as HTMLCanvasElement);
// constants used in the mocked code
const SCREEN_HEIGHT = gfx.height;
const SCREEN_WIDTH = gfx.width;
const MINI_BLACK = "black";
const MINI_WHITE = "white";
const ArialMT_Plain_10: Font = [10, "Arial"];
const ArialMT_Plain_24: Font = [24, "Arial"];
const Meteocons_Plain_21: Font = [21 * 0.8 , "Arial  "];
const Meteocons_Plain_42: Font = [42 * 0.9, "Arial"];
const TEXT_ALIGN_CENTER = "center";
const TEXT_ALIGN_LEFT = "left";
const TEXT_ALIGN_RIGHT = "right";
const Y_Time = SCREEN_HEIGHT - 12;
const Y_Buttons = -2;

// Drawing functions

function drawForecast() {
    drawForecastDetail(SCREEN_WIDTH - 42 * 6, 65, 1);
    drawForecastDetail(SCREEN_WIDTH - 42 * 5, 65, 2);
    drawForecastDetail(SCREEN_WIDTH - 42 * 4, 65, 3);
    drawForecastDetail(SCREEN_WIDTH - 42 * 3, 65, 4);
    drawForecastDetail(SCREEN_WIDTH - 42 * 2, 65, 5);
    drawForecastDetail(SCREEN_WIDTH - 42, 65, 6);
}

// helper for the forecast columns
function drawForecastDetail(x, y, index) {
    gfx.setFont(ArialMT_Plain_10);
    gfx.setTextAlignment(TEXT_ALIGN_CENTER);
    let hour = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][index];
    hour.toUpperCase();
    gfx.drawString(x + 25, y + 1, hour);
    gfx.setColor(MINI_BLACK);
    gfx.drawString(x + 23, y + 15, Math.floor(10 + Math.random() * 30) + "°|" + Math.floor(10 + Math.random() * 30) + "°");    // temp PoP
    gfx.setFont(Meteocons_Plain_21)
    let weatherIcon = index % 2 == 0 ? "❄" : "☼";
    gfx.drawString(x + 25, y + 29, weatherIcon);
    gfx.drawLine(x + 2, y, x + 2, y + 51);
    gfx.drawLine(x + 2, y + 13, x + 43, y + 13);


}

function drawBattery() {
    let percentage = Math.floor(Math.random() * 100);
    let power = 4.1;
    gfx.setColor(MINI_BLACK);
    gfx.setFont(ArialMT_Plain_10);
    gfx.setTextAlignment(TEXT_ALIGN_RIGHT);
    gfx.drawString(SCREEN_WIDTH - 22, Y_Time + 1, String(power) + "V " + String(percentage) + "% ");
    gfx.drawRect(SCREEN_WIDTH - 22, Y_Time + 2, 19, 10);
    gfx.fillRect(SCREEN_WIDTH - 2, Y_Time + 4, 2, 6);
    gfx.fillRect(SCREEN_WIDTH - 20, Y_Time + 4, 16 * percentage / 100, 6);
}


function drawTime() {
    gfx.setTextAlignment(TEXT_ALIGN_LEFT);
    gfx.setFont(ArialMT_Plain_10);
    gfx.setColor(MINI_BLACK);
    let time = new Date();
    let time_str = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    gfx.drawString(2, Y_Time, "Updated " + time_str);
}

function drawWifiQuality() {
    let quality = Math.floor(Math.random() * 100);
    gfx.setColor(MINI_BLACK);
    gfx.setTextAlignment(TEXT_ALIGN_LEFT);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2 * (i + 1); j++) {
            if (quality > i * 25 || j == 0) {
                gfx.setPixel(SCREEN_WIDTH / 2 + 30 + 2 * i, Y_Time + 10 - j);
            }
        }
    }

    gfx.drawString(SCREEN_WIDTH / 2 + 40, Y_Time + 1, String(quality) + "%");
}

function drawButtons() {
    gfx.setColor(MINI_BLACK);
    let third = SCREEN_WIDTH / 3;
    gfx.setColor(MINI_BLACK);
    gfx.drawLine(2 * third, Y_Buttons, 2 * third, Y_Buttons + 12);
    gfx.setTextAlignment(TEXT_ALIGN_CENTER);
    gfx.setFont(ArialMT_Plain_10);
    gfx.drawString(0.5 * third, Y_Buttons, "Config");
    gfx.drawString(2.5 * third, Y_Buttons, "Refresh");
}


function drawDivLines() {
    gfx.drawLine(0, SCREEN_HEIGHT - 12, SCREEN_WIDTH, SCREEN_HEIGHT - 12);
    gfx.drawLine(0, 11, SCREEN_WIDTH, 11);
}

function drawMiscText() {
    gfx.setColor(MINI_BLACK);
    gfx.setTextAlignment(TEXT_ALIGN_LEFT);
    gfx.setFont(Meteocons_Plain_42);
    gfx.drawString(10, 15, Math.random() > 0.95 ? "❄" : "☼");


    gfx.setTextAlignment(TEXT_ALIGN_RIGHT);
    gfx.setFont(ArialMT_Plain_10);
    gfx.drawString(125, 15, "München");

    gfx.setFont(ArialMT_Plain_24);
    gfx.drawString(125, 25, Math.floor(10 + Math.random() * 20) + "°C");

    gfx.setFont(ArialMT_Plain_10);
    gfx.drawString(125, 50, "Mostly Sunny");

    gfx.setTextAlignment(TEXT_ALIGN_LEFT);
    gfx.drawLine(145, 25, 145, 55);

    gfx.drawString(165, 18, "Humidity: " + Math.floor(10 + Math.random() * 20) + "%");
    gfx.drawString(165, 33, "Pressure: " + Math.floor(10 + Math.random() * 20));
    gfx.drawString(165, 48, "Sun: " + "5:38" + " - " + "10:10");

    gfx.drawLine(0, 65, SCREEN_WIDTH, 65);
}


// repeating render loop
let renderLoop = () => {
    gfx.fillBuffer(MINI_WHITE);
    drawForecast();
    drawTime();
    drawBattery();
    drawWifiQuality();
    drawButtons();
    drawDivLines();
    drawMiscText();
    gfx.commit();
};

window.setInterval(renderLoop, 1000);
renderLoop();
