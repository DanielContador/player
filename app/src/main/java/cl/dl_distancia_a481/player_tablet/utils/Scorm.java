package cl.dl_distancia_a481.player_tablet.utils;

import android.content.Context;
import android.database.Cursor;
import android.util.Log;
import android.webkit.JavascriptInterface;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

import gov.adlnet.xapi.client.StatementClient;
import gov.adlnet.xapi.model.Activity;
import gov.adlnet.xapi.model.ActivityDefinition;
import gov.adlnet.xapi.model.Agent;
import gov.adlnet.xapi.model.InteractionComponent;
import gov.adlnet.xapi.model.Statement;
import gov.adlnet.xapi.model.Verb;
import gov.adlnet.xapi.model.Verbs;

/**
 * Created by andresfsantamarian on 5/13/16.
 */

public class Scorm {

    private String SCO;
    private Persona persona;
    private String Actividad;
    private int CourseId ;
    private int StudentId ;
    private int RegistroId;

    private String idEvento;
    private Context context;

    public Scorm(Context c){
        context = c;
    }

    @JavascriptInterface
    public int getRegistroId() {
        return RegistroId;
    }

    @JavascriptInterface
    public void setRegistroId(int registriId) {
        RegistroId = registriId;
    }

    @JavascriptInterface
    public String getIdEvento() {
        return idEvento;
    }

    @JavascriptInterface
    public void setIdEvento(String idEvento) {
        this.idEvento = idEvento;
    }

    @JavascriptInterface
    public int getCourseId() {
        return CourseId;
    }

    @JavascriptInterface
    public void setCourseId(int courseId) {
        CourseId = courseId;
    }

    @JavascriptInterface
    public int getStudentId() {
        return StudentId;
    }

    @JavascriptInterface
    public String getStudentName() {
        //return persona.getNombre();
        return "";
    }

    @JavascriptInterface
    public void setStudentId(int studentId) {
        StudentId = studentId;
    }

    @JavascriptInterface
    public String getActividad() {
        return Actividad;
    }

    @JavascriptInterface
    public void setActividad(String actividad) {
        Actividad = actividad;
    }

    @JavascriptInterface
    public String getSCO() {
        return SCO;
    }

    @JavascriptInterface
    public void setSCO(String SCO) {
        this.SCO = SCO;
    }

    @JavascriptInterface
    public String getScorm(String name, String activityId, String StudentId){

        String output="";

        DbHelper dbHelper = DbHelper.getHelper(context);
        Cursor cursor = dbHelper.GetRegistroActividadScorm(name,activityId,StudentId);

        //Create output manual Object
        try{
            if (cursor.moveToFirst()) {
                output = cursor.getString(2);
            }
            }
        catch (Exception e){
            Log.d("Get_Scorm", "No Existe Registro Actividad");
        }

        if(name.equals("toc_data")) //when passing that player don't work well
            return output;
        else
            return "";
    }

    @JavascriptInterface
    public String setScorm(String id, String scormData, String activityId,String version){

        String output="";
        Sco message = new Sco();
        message.setName(id);
        message.setStudentId(getRegistroId());
        message.setTheData(scormData);
        message.setActivityId(activityId);
        /*if (message.getName() != "finish"
                && message.getName() != "toc-data"
                && message.getName() != "initialize")
        {
            message.setParsedData(new ParsedScorm(message));
        }*/
        Log.d("scorm",version);
        String idregistro = Integer.toString(message.getStudentId());
        String name = message.getName();
        scormData = scormData.replace("\"{","{");
        scormData = scormData.replace("}\"","}");
        //scormData = scormData.replace("\\\\r\\\\n\\\\r\\\\n","'");
        //scormData = scormData.replace("\\\\r\\\\n","'");
        scormData = scormData.replace("\\\\\\\"", "");
        String CleanScormData = scormData.replace("\\", "");
        try{
            CleanScormData = URLDecoder.decode(CleanScormData, "UTF-8").toString();
        }catch(Exception e){

        }

        //Save to database
        DbHelper db = DbHelper.getHelper(context);

        boolean IntentosMax = db.InsertRegistroActividad(id, activityId, idregistro, CleanScormData, version);

        return output;
    }

    @JavascriptInterface
    public String save(String actorName, String activityId, String verbName, String idPersona, String idCurso, int idSociedad, int idEvento){

        try {
            StatementClient client = new StatementClient("http://192.168.3.24:8000/public/data/xAPI/", "b7942cc410426232fab5131548fd77904fa215fd",
                    "1beb8d6e29848b8ee38bb762dbf557d8953660fb");

            Statement statement = new Statement();

            Agent agent = new Agent();

            Verb verb ;

            int estado = 0;
            switch (verbName) {

                case "initialize":
                    verb = Verbs.initialized();
                    estado = 1;

                    break;
                case "finish":
                    verb = Verbs.terminated();
                    estado = 3;

                    break;
                case "exited":
                    verb = Verbs.exited();
                    estado = 3;

                    break;
                default:
                    verb = Verbs.experienced();
                    estado = 2;

                    break;
            }


            agent.setMbox("mailto:test@example.com");
            agent.setName(actorName);
            statement.setActor(agent);
            statement.setId(UUID.randomUUID().toString());
            statement.setVerb(verb);
            Activity a = new Activity();
            a.setId("http://dl.cl/"+idPersona + "/"+idCurso);
            statement.setObject(a);
            ActivityDefinition ad = new ActivityDefinition();
            ad.setChoices(new ArrayList<InteractionComponent>());

            ad.setName(new HashMap<String, String>());
            ad.getName().put("en-US", activityId);
            InteractionComponent ic = new InteractionComponent();
            ic.setId("http://example.com");
            ic.setDescription(new HashMap<String, String>());
            ic.getDescription().put("en-US", "tests");
            ad.getChoices().add(ic);
            ad.setInteractionType("choice");
            ad.setMoreInfo("http://example.com");
            a.setDefinition(ad);

            String publishedId = client.postStatement(statement);
            //informLMS(idEvento,idPersona, estado);
            return publishedId;
        } catch (MalformedURLException e) {
            // TODO Auto-generated catch block
            //e.printStackTrace();
            return e.getMessage();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            //e.printStackTrace();
            return e.getMessage();
        }catch(Exception e){
            return e.getMessage();
        }

    }

    @JavascriptInterface
    public Persona getPersona() {
        return persona;
    }

    @JavascriptInterface
    public void setPersona(Persona persona) {
        this.persona = persona;
    }
}
