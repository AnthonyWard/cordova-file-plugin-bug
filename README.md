# Cordova File Plugin Bug (Android)

## To Recreeate

- Run `cordova prepare android`
- Run `cordova build android`
- Open in android studio
- See console output (via Chrome Remote Debug or Logcat)

The file is not read correctly, it is much longer than it should be.

## The problem

`CordovaResourceApi.java` method `OpenForReadResult` return a `-1` length to `Filesystem.java` method `readFileAtURL` causing file corruption as each chunk effectively has no end.

## Fix

Possible fix in the plugin `cordova-plugin-file`:

https://github.com/apache/cordova-plugin-file/pull/217
https://issues.apache.org/jira/browse/CB-13245?jql=text%20~%20%22CordovaResourceApi%22

Or should it be fixed upstream in `cordova-android` here:

https://github.com/apache/cordova-android/blob/master/framework/src/org/apache/cordova/CordovaResourceApi.java

In the method `OpenForReadResult` there is one path (in the `catch`) that leaves the length as -1 causing the defect

```java
case URI_TYPE_ASSET: {
                String assetPath = uri.getPath().substring(15);
                AssetFileDescriptor assetFd = null;
                InputStream inputStream;
                long length = -1;
                try {
                    assetFd = assetManager.openFd(assetPath);
                    inputStream = assetFd.createInputStream();
                    length = assetFd.getLength();
                } catch (FileNotFoundException e) {
                    // Will occur if the file is compressed.
                    inputStream = assetManager.open(assetPath);
                }
                String mimeType = getMimeTypeFromPath(assetPath);
                return new OpenForReadResult(uri, inputStream, mimeType, length, assetFd);
            }
```

Adding `length = inputStream.available();` in the catch fixes the issue for me, but I'm not a java developer so can't evaluate if that's a bad idea for another reason.