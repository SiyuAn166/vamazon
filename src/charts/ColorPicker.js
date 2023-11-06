import "../App.css";
import React, { useEffect, useRef, useState } from "react";

const ColorPicker = ({color, onColorChange}) => {
    const can = useRef(null);
    const cur = useRef(null);
    const width = 256;
    const curColor = color;
    const [rgbValue, setRgbValue] = useState([]);

    const colorBar = () => {
        const ctx = can.current.getContext("2d");
        const gradientBar = ctx.createLinearGradient(0, 0, 0, width);
        gradientBar.addColorStop(0, "#f00");
        gradientBar.addColorStop(1 / 6, "#f0f");
        gradientBar.addColorStop(2 / 6, "#00f");
        gradientBar.addColorStop(3 / 6, "#0ff");
        gradientBar.addColorStop(4 / 6, "#0f0");
        gradientBar.addColorStop(5 / 6, "#ff0");
        gradientBar.addColorStop(1, "#f00");
        ctx.fillStyle = gradientBar;
        ctx.fillRect(0, 0, 20, width);
    };

    const colorBox = (color) => {
        const ctx = can.current.getContext("2d");
        const gradientBase = ctx.createLinearGradient(30, 0, width + 30, 0);
        gradientBase.addColorStop(1, color);
        gradientBase.addColorStop(0, "rgba(255,255,255,1)");
        ctx.fillStyle = gradientBase;
        ctx.fillRect(30, 0, width, width);
        const gradientScreen = ctx.createLinearGradient(0, 0, 0, width);
        gradientScreen.addColorStop(0, "rgba(0,0,0,0)");
        gradientScreen.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = gradientScreen;
        ctx.fillRect(30, 0, width, width);
    };

    useEffect(() => {
        colorBar();
        colorBox(curColor);
        can.current.addEventListener("click", (e) => {
            const coorX = e.offsetX || e.layerX;
            const coorY = e.offsetY || e.layerY;
            const ctx = can.current.getContext("2d");
            const imgData = ctx.getImageData(coorX, coorY, 1, 1);
            const { data } = imgData;
            const rgbaStr = [data[0], data[1], data[2]];
            setRgbValue(rgbaStr);
            onColorChange(rgbaStr);
            if (coorX && coorX < 20 && coorY >= 0 && coorY < width) {
                colorBox(`rgba(${rgbaStr.join(",")})`);
            }
            cur.current.style.left = `${coorX}px`;
            cur.current.style.top = `${coorY}px`;
            cur.current.style.outlineColor =
                rgbaStr[0] > 128 || rgbaStr[1] > 128 || rgbaStr[2] > 128
                    ? "#000"
                    : "#fff";
        });
    }, [curColor, onColorChange]);

    return (
        <div className="colorPicker">
            <div className="wrapper">
                <canvas className="canvas" width="300" height="300" ref={can} />
                <em className="cur" ref={cur} />
            </div>
            <div>
                Color: rgb({rgbValue.join(",")})
                {rgbValue.length === 3 && (
                    <div
                        style={{
                            height: 50,
                            width: 50,
                            background: `rgba(${rgbValue.join(",")})`
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ColorPicker;
