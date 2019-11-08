var Gfx = /** @class */ (function () {
    function Gfx(canvas, width, height) {
        if (width === void 0) { width = 296; }
        if (height === void 0) { height = 128; }
        this.width = 296;
        this.height = 128;
        this.fontSize = 10;
        var offscreenCanvas = document.createElement('canvas');
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
    Gfx.prototype.drawString = function (x, y, text) {
        this.offscreenCtx.fillText(text, x, y + this.fontSize - 1);
    };
    Gfx.prototype.fillRect = function (x1, y1, width, height) {
        this.offscreenCtx.fillRect(x1, y1, width, height);
    };
    Gfx.prototype.drawRect = function (x1, y1, width, height) {
        this.offscreenCtx.strokeRect(x1, y1, width, height);
    };
    Gfx.prototype.setColor = function (color) {
        this.offscreenCtx.fillStyle = color;
        this.offscreenCtx.strokeStyle = color;
    };
    Gfx.prototype.setFont = function (font) {
        this.offscreenCtx.font = font[0] + "px " + font[1];
        this.fontSize = font[0];
    };
    Gfx.prototype.setTextAlignment = function (alignment) {
        this.offscreenCtx.textAlign = alignment;
    };
    Gfx.prototype.drawLine = function (x1, y1, x2, y2) {
        this.offscreenCtx.beginPath();
        this.offscreenCtx.moveTo(x1, y1);
        this.offscreenCtx.lineTo(x2, y2);
        this.offscreenCtx.stroke();
    };
    Gfx.prototype.commit = function () {
        this.ctx.drawImage(this.offscreenCtx.canvas, 0, 0);
    };
    Gfx.prototype.getWidth = function () {
        return this.width;
    };
    Gfx.prototype.getHeight = function () {
        return this.height;
    };
    Gfx.prototype.setPixel = function (x, y) {
        this.offscreenCtx.fillRect(x, y, 1, 1);
    };
    Gfx.prototype.fillBuffer = function (color) {
        var old_color = this.offscreenCtx.fillStyle;
        this.offscreenCtx.fillStyle = color;
        this.offscreenCtx.fillRect(0, 0, this.width, this.height);
        this.offscreenCtx.fillStyle = old_color;
    };
    return Gfx;
}());
/* Mocking example
 * Based on the arduino code of the following project:
 * https://github.com/cxandy/AZSMZ-EPAPER/blob/master/weatherstation/weatherstation.ino
 * */
var gfx = new Gfx(document.getElementById("canvas"));
// constants used in the mocked code
var SCREEN_HEIGHT = gfx.height;
var SCREEN_WIDTH = gfx.width;
var MINI_BLACK = "black";
var MINI_WHITE = "white";
var ArialMT_Plain_10 = [10, "Arial"];
var ArialMT_Plain_24 = [24, "Arial"];
var Meteocons_Plain_21 = [21 * 0.8, "Arial  "];
var Meteocons_Plain_42 = [42 * 0.9, "Arial"];
var TEXT_ALIGN_CENTER = "center";
var TEXT_ALIGN_LEFT = "left";
var TEXT_ALIGN_RIGHT = "right";
var Y_Time = SCREEN_HEIGHT - 12;
var Y_Buttons = -2;
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
    var hour = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][index];
    hour.toUpperCase();
    gfx.drawString(x + 25, y + 1, hour);
    gfx.setColor(MINI_BLACK);
    gfx.drawString(x + 23, y + 15, Math.floor(10 + Math.random() * 30) + "°|" + Math.floor(10 + Math.random() * 30) + "°"); // temp PoP
    gfx.setFont(Meteocons_Plain_21);
    var weatherIcon = index % 2 == 0 ? "❄" : "☼";
    gfx.drawString(x + 25, y + 29, weatherIcon);
    gfx.drawLine(x + 2, y, x + 2, y + 51);
    gfx.drawLine(x + 2, y + 13, x + 43, y + 13);
}
function drawBattery() {
    var percentage = Math.floor(Math.random() * 100);
    var power = 4.1;
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
    var time = new Date();
    var time_str = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    gfx.drawString(2, Y_Time, "Updated " + time_str);
}
function drawWifiQuality() {
    var quality = Math.floor(Math.random() * 100);
    gfx.setColor(MINI_BLACK);
    gfx.setTextAlignment(TEXT_ALIGN_LEFT);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 2 * (i + 1); j++) {
            if (quality > i * 25 || j == 0) {
                gfx.setPixel(SCREEN_WIDTH / 2 + 30 + 2 * i, Y_Time + 10 - j);
            }
        }
    }
    gfx.drawString(SCREEN_WIDTH / 2 + 40, Y_Time + 1, String(quality) + "%");
}
function drawButtons() {
    gfx.setColor(MINI_BLACK);
    var third = SCREEN_WIDTH / 3;
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
var renderLoop = function () {
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
