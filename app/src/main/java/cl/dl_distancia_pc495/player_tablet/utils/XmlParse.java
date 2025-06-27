package cl.dl_distancia_a481.player_tablet.utils;

import android.content.Context;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.json.XML;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;

/**
 * Created by Developer Android on 02-02-2017.
 */

public class XmlParse {
    Context context;
    String path;
    ArrayList<TocItem> tocItems = new ArrayList<>();

    public XmlParse(Context c, String CurseId){
        context = c;
        //path = "www/player/courses/" + CurseId + "/imsmanifest.xml";
        path = "www" + File.separator + "player" + File.separator + "courses" + File.separator + CurseId + File.separator + "imsmanifest.xml";
    }

    public JSONObject xml2json(String path){
        JSONObject jsonObj = null;
        String xmlstring = "";
        try {
            InputStream stream = context.getAssets().open(path);
            //xmlstring = getStringFromFile(path);
            xmlstring = convertStreamToString(stream);
            jsonObj = XML.toJSONObject(xmlstring);
        } catch (JSONException e) {
            Log.e("JSON exception", e.getMessage());
            e.printStackTrace();
        }
        catch (Exception e){
            Log.e("Read File exception", e.getMessage());
            e.printStackTrace();
        }

        //Log.d("XML", xmlstring);
        //Log.d("JSON", jsonObj.toString());
        return jsonObj;
    }

    public static String convertStreamToString(InputStream is) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line = null;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }
        reader.close();
        return sb.toString();
    }

    public static String getStringFromFile (String filePath) throws Exception {
        File fl = new File(filePath);
        FileInputStream fin = new FileInputStream(fl);
        String ret = convertStreamToString(fin);
        //Make sure you close all streams.
        fin.close();
        return ret;
    }

    public TocPlayer GetToc(){
        TocPlayer toc = new TocPlayer();

        try {
            JSONObject jsonmanifest = xml2json(path);
            JSONObject content = jsonmanifest.getJSONObject("manifest").getJSONObject("organizations").getJSONObject("organization");
            toc.setOrganization(content.getString("title"));
            Object json = new JSONTokener(content.getString("item")).nextValue();

            getItems(1,json, content.getString("identifier"), toc.getItems());
        }
        catch (JSONException e){
            e.printStackTrace();
        }
        return toc;
    }

    public void getItems(int depth, Object json, String parent, ArrayList<TocItem> items){

        if (json instanceof JSONObject) {
            JSONObject _json = (JSONObject) json;
            try {
                TocItem tocitem = new TocItem();
                //Set Basic Properties
                tocitem.setName(_json.getString("title"));
                tocitem.setIdentifier(_json.getString("identifier"));
                tocitem.setParentidentifier(parent);
                tocitem.setDepth(depth);

                try{//If Father
                    Object obj = new JSONTokener(_json.getString("item")).nextValue();
                    tocitem.setParent(true);
                    items.add(tocitem);
                    getItems(depth+1, obj, tocitem.identifier, items);

                }catch (JSONException e){// if Activity, set Parent false, identifierref
                    tocitem.setParent(false);
                    tocitem.setIdentifierref(_json.getString("identifierref"));
                    items.add(tocitem);
                }
            }
            catch (JSONException e){
                //return tocitem;
            }
        }
        else {
            JSONArray _jsonarray = ((JSONArray) json);
            int lengthJsonArr = _jsonarray.length();
            for (int i = 0; i < lengthJsonArr; i++) {
                try {
                    TocItem tocitem = new TocItem();
                    //Set Basic Properties
                    tocitem.setName(_jsonarray.getJSONObject(i).getString("title"));
                    tocitem.setIdentifier(_jsonarray.getJSONObject(i).getString("identifier"));
                    tocitem.setParentidentifier(parent);
                    tocitem.setDepth(depth);

                    try{//If Father get item
                        Object obj = new JSONTokener(_jsonarray.getJSONObject(i).getString("item")).nextValue();
                        tocitem.setParent(true);
                        items.add(tocitem);
                        getItems(depth+1, obj, tocitem.identifier, items);

                    }catch (JSONException e){// if Activity, set Parent false, identifierref
                        tocitem.setParent(false);
                        tocitem.setIdentifierref(_jsonarray.getJSONObject(i).getString("identifierref"));
                        items.add(tocitem);
                    }

                }
                catch (JSONException e){
                    //return tocitem;
                }
            }
        }
        //return tocitem;
    }

}

