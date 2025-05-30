package cl.dl_distancia_a481.player_tablet.utils;
import android.util.Log;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

public class JsonParser {

    //Post from DL web service
    public static JSONObject readJsonPostFromUrl(String url, StringEntity params) throws IOException, JSONException {
        InputStream inputStream = null;
        String result = "";
        HttpPost httpPost;
        HttpResponse httpResponse;
        try {
            HttpParams p = new BasicHttpParams();
            // Set the timeout in milliseconds until a connection is established.
            int timeoutConnection = 1000;
            HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);

            // in milliseconds which is the timeout for waiting for data.
            int timeoutSocket = 1000;
            HttpConnectionParams.setSoTimeout(p, timeoutSocket);

            HttpClient httpclient = new DefaultHttpClient(p);

            httpPost = new HttpPost(url);

            httpPost.addHeader("Content-type", "application/json");
            httpPost.addHeader("method", "POST");
            httpPost.setEntity(params);
            httpResponse = httpclient.execute(httpPost);
            inputStream = httpResponse.getEntity().getContent();
            if (inputStream != null)
                result = convertInputStreamToString(inputStream);
            else
                result = "Did not work!";

        } catch (Exception e) {
            try{
                HttpParams p = new BasicHttpParams();

                int timeoutConnection = 1000;
                HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);

                int timeoutSocket = 1000;
                HttpConnectionParams.setSoTimeout(p, timeoutSocket);

                HttpClient httpclient = new DefaultHttpClient(p);

                httpPost = new HttpPost(url);

                httpPost.addHeader("Content-type", "application/json");
                httpPost.addHeader("method", "POST");
                httpPost.setEntity(params);
                httpResponse = httpclient.execute(httpPost);
                inputStream = httpResponse.getEntity().getContent();

                if (inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";
            }
            catch (Exception ex){
                HttpParams p = new BasicHttpParams();

                int timeoutConnection = 1000;
                HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);

                int timeoutSocket = 1000;
                HttpConnectionParams.setSoTimeout(p, timeoutSocket);

                HttpClient httpclient = new DefaultHttpClient(p);

                httpPost = new HttpPost(url);

                httpPost.addHeader("Content-type", "application/json");
                httpPost.addHeader("method", "POST");
                httpPost.setEntity(params);
                httpResponse = httpclient.execute(httpPost);
                inputStream = httpResponse.getEntity().getContent();

                if (inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";
            }
        }
        return new JSONObject(result);
    }

    public static JSONObject readJsonPostFromUrlText(String url, StringEntity params) throws IOException, JSONException {
        InputStream inputStream = null;
        String result = "";
        HttpPost httpPost;

        HttpResponse httpResponse;
        try {
            HttpParams p = new BasicHttpParams();
            // Set the timeout in milliseconds until a connection is established.
            int timeoutConnection = 1000;
            HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);

            // in milliseconds which is the timeout for waiting for data.
            int timeoutSocket = 1000;
            HttpConnectionParams.setSoTimeout(p, timeoutSocket);

            HttpClient httpclient = new DefaultHttpClient(p);

            httpPost = new HttpPost(url);

            httpPost.addHeader("Content-type", "application/json; charset=utf-8");
            httpPost.addHeader("method", "POST");
            httpPost.setEntity(params);
            httpResponse = httpclient.execute(httpPost);
            inputStream = httpResponse.getEntity().getContent();
            if (inputStream != null)
                result = convertInputStreamToString(inputStream);
            else
                result = "Did not work!";

        } catch (Exception e) {
            try{
                HttpParams p = new BasicHttpParams();

                int timeoutConnection = 1000;
                HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);

                int timeoutSocket = 1000;
                HttpConnectionParams.setSoTimeout(p, timeoutSocket);

                HttpClient httpclient = new DefaultHttpClient(p);

                httpPost = new HttpPost(url);

                httpPost.addHeader("Content-type", "                                                                                                                                                                                                                                                  ");
                httpPost.addHeader("method", "POST");
                httpPost.setEntity(params);
                httpResponse = httpclient.execute(httpPost);
                inputStream = httpResponse.getEntity().getContent();

                if (inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";
            }
            catch (Exception ex){
                HttpParams p = new BasicHttpParams();

                int timeoutConnection = 1000;
                HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);

                int timeoutSocket = 1000;
                HttpConnectionParams.setSoTimeout(p, timeoutSocket);

                HttpClient httpclient = new DefaultHttpClient(p);

                httpPost = new HttpPost(url);

                httpPost.addHeader("Content-type", "application/json");
                httpPost.addHeader("method", "POST");
                httpPost.setEntity(params);
                httpResponse = httpclient.execute(httpPost);
                inputStream = httpResponse.getEntity().getContent();

                if (inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";
            }
        }
        return new JSONObject(result);
    }
    //Get from DL web service
    public static JSONObject readJsonGetFromUrl(String url) throws IOException, JSONException {
        InputStream inputStream = null;
        String result = "";
        HttpGet httpGet;
        HttpClient httpclient;
        HttpResponse httpResponse;

        try {
            HttpParams p = new BasicHttpParams();
            int timeoutConnection = 1000;
            HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);
            int timeoutSocket = 1000;
            HttpConnectionParams.setSoTimeout(p, timeoutSocket);
            httpclient = new DefaultHttpClient(p);
            url = url.replace(" ", "");
            httpGet = new HttpGet(url);

            httpResponse = httpclient.execute(httpGet);
            inputStream = httpResponse.getEntity().getContent();
            if (inputStream != null)
                result = convertInputStreamToString(inputStream);
            else
                result = "Did not work!";

        } catch (Exception e) {
            try {
                HttpParams p = new BasicHttpParams();
                int timeoutConnection = 1000;
                HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);
                int timeoutSocket = 1000;
                HttpConnectionParams.setSoTimeout(p, timeoutSocket);
                httpclient = new DefaultHttpClient(p);
                httpGet = new HttpGet(url);

                httpResponse = httpclient.execute(httpGet);
                inputStream = httpResponse.getEntity().getContent();
                if (inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";
            }
            catch (Exception e1){
                HttpParams p = new BasicHttpParams();
                int timeoutConnection = 1000;
                HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);
                int timeoutSocket = 1000;
                HttpConnectionParams.setSoTimeout(p, timeoutSocket);
                httpclient = new DefaultHttpClient(p);
                httpGet = new HttpGet(url);

                httpResponse = httpclient.execute(httpGet);
                inputStream = httpResponse.getEntity().getContent();
                if (inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";
            }
        }

        return new JSONObject(result);
    }

    //Get from DL web service
    public static String readGetFromUrl(String url) throws IOException, JSONException {
        InputStream inputStream = null;
        String result = "";
        HttpGet httpGet;
        HttpClient httpclient;
        HttpResponse httpResponse;

        try {
            HttpParams p = new BasicHttpParams();
            int timeoutConnection = 1000;
            HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);
            int timeoutSocket = 1000;
            HttpConnectionParams.setSoTimeout(p, timeoutSocket);
            httpclient = new DefaultHttpClient(p);
            url = url.replace(" ", "");
            httpGet = new HttpGet(url);

            httpResponse = httpclient.execute(httpGet);
            inputStream = httpResponse.getEntity().getContent();
            if (inputStream != null)
                result = convertInputStreamToString(inputStream);
            else
                result = "Did not work!";

        } catch (Exception e) {
            try {
                HttpParams p = new BasicHttpParams();
                int timeoutConnection = 1000;
                HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);
                int timeoutSocket = 1000;
                HttpConnectionParams.setSoTimeout(p, timeoutSocket);
                httpclient = new DefaultHttpClient(p);
                httpGet = new HttpGet(url);

                httpResponse = httpclient.execute(httpGet);
                inputStream = httpResponse.getEntity().getContent();
                if (inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";
            }
            catch (Exception e1){
                HttpParams p = new BasicHttpParams();
                int timeoutConnection = 1000;
                HttpConnectionParams.setConnectionTimeout(p, timeoutConnection);
                int timeoutSocket = 1000;
                HttpConnectionParams.setSoTimeout(p, timeoutSocket);
                httpclient = new DefaultHttpClient(p);
                httpGet = new HttpGet(url);

                httpResponse = httpclient.execute(httpGet);
                inputStream = httpResponse.getEntity().getContent();
                if (inputStream != null)
                    result = convertInputStreamToString(inputStream);
                else
                    result = "Did not work!";
            }
        }

        if(!result.equals("")){
            String[] parts = result.split(">");
            parts = parts[1].split("<");
            result = parts[0];
        }

        return result;
    }

    //HttpURLConnection
    public InputStream getHttpConnection(String urlString)  throws IOException {

        InputStream stream = null;
        java.net.URL url = new URL(urlString);
        URLConnection connection = url.openConnection();

        try {
            HttpURLConnection httpConnection = (HttpURLConnection) connection;
            httpConnection.setRequestMethod("GET");
            httpConnection.connect();

            if (httpConnection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                stream = httpConnection.getInputStream();
            }
        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
        return stream;
    }

    public static String GetKeyValue(String data,String key){
    String value = "";
    try{
    JSONObject obj = new JSONObject(data);
    value = obj.getString(key);
    }catch(Exception e){
        Log.d("Parse", e.getLocalizedMessage());

    }
    return value;
}

    private static String convertInputStreamToString(InputStream inputStream) throws IOException {
        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
        String line = "";
        String result = "";
        while ((line = bufferedReader.readLine()) != null)
            result += line;

        inputStream.close();
        return result;
    }

    public boolean isJSONValid(String test) {
        try {
            new JSONObject(test);
        } catch (JSONException ex) {
            // edited, to include @Arthur's comment
            // e.g. in case JSONArray is valid as well...
            try {
                new JSONArray(test);
            } catch (JSONException ex1) {
                return false;
            }
        }
        return true;
    }
}