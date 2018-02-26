document.addEventListener('deviceready', onDeviceReady, false);  
function onDeviceReady() {  
    function readFromFile(fileName, cb) {
        var pathToFile = cordova.file.applicationDirectory + fileName;
        window.resolveLocalFileSystemURL(pathToFile, (fileEntry) => {
            fileEntry.file((file) => {
                var reader = new FileReader();

                reader.onloadend = (e) => {
                    console.log(`Should be 10000 lines but is ${this.result.split(/\r\n|\r|\n/).length}`);
                    console.log(`Add breakpoint here and in type copy(this.result) to get it in your clipboard`);
                };

                reader.readAsText(file);
            }, (err) => console.log(err));
        }, (err) => console.log(err));
    }

    var fileData;
    readFromFile('www/test.txt', function (data) {
        fileData = data;
    });
}