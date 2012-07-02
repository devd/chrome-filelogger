/*global chrome:false, FileError: false, window: false , console:false */
(function () {
    'use strict';

    function errorHandler(e) {
        var msg = '';

        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        }

        window.alert('Error: ' + msg);
        console.log('Error: ' + msg);
    }

    var fs = null,
        writeMessage = function (extensionid, msg) {
            if (!fs) {
                window.alert("Error! fs is null");
                return;
            }
            fs.root.getFile(extensionid + '.txt', {
                create: true
            }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onerror = function (e) {
                        window.alert("Error writing" + msg + "\t" + e);
                    };
                    fileWriter.seek(fileWriter.length); // Start write position at EOF.
                    // Create a new Blob and write it to log.txt.
                    var bb = new window.WebKitBlobBuilder();
                    bb.append("\n" + JSON.stringify(msg) + "\n");
                    fileWriter.write(bb.getBlob('text/plain'));
                }, errorHandler); //end createWriter callback
            }, errorHandler); //end of getFile Callback
        },
        onInitFs = function (f) {
            fs = f;
            chrome.extension.onRequestExternal.addListener(function (request, sender) {
                writeMessage(sender.id, request);
            });

            chrome.extension.onConnectExternal.addListener(

            function (port) {
                port.onMessage.addListener(

                function (msg) {
                    writeMessage(port.sender.id, msg);
                }); //end onMessage Listener
            }); //end onconnectexternal listener
        }; //end on InitFs
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    window.webkitStorageInfo.requestQuota(window.PERSISTENT, 1024 * 1024, function (grantedBytes) {
        window.requestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, errorHandler);
    }, function (e) {
        window.alert('Request Quota Error');
        console.log('Error', e);
    });
}());
