export function mergeImg(dataArr, callback, imgFormat) {
    if (dataArr.length < 1) {
        return
    }
    let c = document.createElement('canvas'),
        ctx = c.getContext('2d'),
        len = dataArr.length;

    c.width = 750;
    c.height = 1200;
    // ctx.rect(0, 0, c.width, c.height);
    // ctx.fillStyle = '#fff';
    // ctx.fill();

    drawing(0);

    function drawing(n) {
        if (n < len) {
            let img = new Image;
            // img.crossOrigin = 'anonymous'; //解决跨域

            img.src = dataArr[n];
            // img.setAttribute("crossOrigin", 'Anonymous');
            img.onload = function () {
                // if (n == 1) {
                //     ctx.drawImage(img, 55, 1015, 200, 200); //121和129表示二维码距离背景图片左上角的X轴，Y轴，160表示生成的图片中二维码的大小
                // } else {
                // }
                ctx.drawImage(img, n * c.width / 2, 0);

                drawing(n + 1); //递归
            }
        } else {

            console.log(c)

            callback(c.toDataURL(imgFormat || "image/png", 1))

            // try {

            //     //保存生成作品图片
            //     base64.push(c.toDataURL("image/png", 1)); //通过canvas.toDataURL转成base64.


            //     document.getElementById('imgBox').innerHTML = '<img style="width:100%" class="invite_qrImg" src="' + base64[0] + '">';

            //     //                        alert(base64[0].length)
            // } catch (e) {
            //     //TODO handle the exception
            //     console.log(alert(e))
            // }

        }
    }

}