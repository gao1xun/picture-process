export function blobToBase64(file, callback) {

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        // result 开头有base64
        console.log(e)
        callback.call(this, this.result);
    }
}

export function getContentType(base64) {
    let arr = /data:([^;]*);/i.exec(base64)
    return arr && arr.length > 0 ? arr[1] : base64;
}

export function getData(base64) {
    return base64.indexOf("base64,") > -1 ? base64.substr(base64.indexOf("base64,") + 7, base64.length) : base64;
}