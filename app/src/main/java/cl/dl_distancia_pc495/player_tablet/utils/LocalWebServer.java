// LocalWebServer.java
package cl.dl_distancia_a481.player_tablet.net;

import android.content.Context;
import android.content.res.AssetManager;
import androidx.annotation.NonNull;
import fi.iki.elonen.NanoHTTPD;
import java.io.*;

public class LocalWebServer extends NanoHTTPD {

    private final AssetManager assets;

    public LocalWebServer(@NonNull Context ctx, int port) {
        super(port);                  // usa 0 si quieres que el SO asigne un puerto libre
        assets = ctx.getAssets();
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();
        if (uri.equals("/")) uri = "/www/player/player.htm";   // raíz

        String assetPath = "www" + uri;                       // /www/…
        try {
            InputStream is = assets.open(assetPath, AssetManager.ACCESS_STREAMING);
            String mime = getMimeType(uri);
            return newChunkedResponse(Response.Status.OK, mime, is);
        } catch (IOException e) {
            return newFixedLengthResponse(Response.Status.NOT_FOUND,
                    NanoHTTPD.MIME_PLAINTEXT, "404 Not Found");
        }
    }

    private String getMimeType(String uri) {
        if (uri.endsWith(".html") || uri.endsWith(".htm")) return "text/html";
        if (uri.endsWith(".js"))   return "application/javascript";
        if (uri.endsWith(".css"))  return "text/css";
        if (uri.endsWith(".pdf"))  return "application/pdf";
        if (uri.endsWith(".png"))  return "image/png";
        if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) return "image/jpeg";
        return "application/octet-stream";
    }
}
