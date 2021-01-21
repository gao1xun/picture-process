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

// blob转file
export const blobToFile = function(newBlob, fileName) {
    newBlob.lastModifiedDate = new Date();
    newBlob.name = fileName;

    let file = new File([newBlob], fileName, { type: newBlob["type"] });
    return file;
};
export function getBlob(base64) {
    return b64toBlob(getData(base64), getContentType(base64));
}

export function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}