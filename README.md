This extension logs to file using the FileSystem API. 

Right now, a major bug is that I don't know how to get the extension ID

From the extension that you want to log from, send
  chrome.extension.sendRequest('aafmhjefpcdalkkdhliijedkjdnmpgpm', anyobject);

anyobject is JSON.stringify'ed and saved to the id of the sending extension.txt

You can see the files at
filesystem:chrome-extension://aafmhjefpcdalkkdhliijedkjdnmpgpm/persistent/
