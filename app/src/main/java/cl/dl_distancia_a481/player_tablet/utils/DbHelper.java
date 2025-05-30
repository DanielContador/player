package cl.dl_distancia_a481.player_tablet.utils;

/**
 * Created by Developer Android on 14-06-2016.
 */

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteDatabase.CursorFactory;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import org.json.JSONObject;

import java.util.Date;

public class DbHelper extends SQLiteOpenHelper {

    private static int version = 1;
    private static boolean APROBADO = true;
    private static boolean REPROBADO = false;
    private static boolean COMPLETED = true;
    private static boolean PROGRESS = false;
    private static int No_init = 1;
    private static int En_curso = 2;
    private static int Completado = 3;
    private static String name = "Scorm_player";
    private static CursorFactory factory = null;
    private static int MaxPorcent = 100;

    private static DbHelper instance;

    String_Utils strUtils = new String_Utils();

    public DbHelper(Context context) {
        super(context, name, factory, version);
    }

    /********************  DB CREATION Funtions    **************/
    /**
     * Funtions to create and upgrade DB
     **/
    //region
    @Override
    public void onCreate(SQLiteDatabase db) {
        Log.i(this.getClass().toString(), "Creando base de datos");

        db.execSQL("CREATE TABLE Eventos(" +
                " _id INTEGER," +
                " idEstadoEvento INTEGER," +
                " idPersona TEXT," +
                " Nombre TEXT, " +
                " FechaInicio TEXT, " +
                " FechaTermino TEXT, " +
                " Horas INTEGER," +
                " Programa TEXT, " +
                " ImagenName TEXT, " +
                " Imagen BLOB, " +
                " Descripcion TEXT, " +
                " CodigoCurso TEXT, " +
                " IdNominaEvento INTEGER," +
                " IdSociedad INTEGER," +
                " CodigoSence TEXT," +
                " RutOtec TEXT," +
                " ClaveOtec TEXT," +
                " SituacionFinal INTEGER," +
                " Time_to_Send TEXT," +
                " IdEstadoNomina INTEGER," +
                " Activo INTEGER)");

        db.execSQL("CREATE TABLE RegistroAlumno(" +
                " _id INTEGER," +
                " idAlumno TEXT," +
                " Path TEXT," +
                " Nombre TEXT," +
                " Descripcion TEXT," +
                " IdCurso INTEGER," +
                " IdEventoLMS INTEGER," +
                " cmi_score_raw TEXT," +
                " TocValue TEXT," +
                " FechaInicio TEXT," +
                " FechaTermino TEXT," +
                " Estado TEXT," +
                " Resultado TEXT," +
                " TiempoTotal TEXT," +
                " ValorScorm TEXT," +
                " Situacion TEXT," +
                " Avance TEXT," +
                " PrimerAcceso TEXT," +
                " UltimoAcceso TEXT," +
                " FechaCompletacion TEXT," +
                " Intentos INTEGER," +
                " MaximoIntentos INTEGER," +
                " IdEstadoRegistroAlumno INTEGER," +
                " IdSituacionRegistroAlumno INTEGER," +
                " IdNominaEvento INTEGER," +
                " Evalua INTEGER," +
                " Puntaje INTEGER," +
                " CantAct INTEGER," +
                " Activo INTEGER)");

        db.execSQL("CREATE TABLE RegistroActividadScorm(" +
                " _id INTEGER PRIMARY KEY AUTOINCREMENT," +
                " Name TEXT," +
                " ScormData TEXT," +
                " Modificado TEXT," +
                " cmi_score TEXT," +
                " FechaInicio TEXT," +
                " FechaTermino TEXT," +
                " cmi_session_time TEXT," +
                " cmi_total_time TEXT," +
                " IdRegistro INTEGER)");

        db.execSQL("CREATE TABLE Noticias(" +
                " _id INTEGER," +
                " Name TEXT," +
                " ImagenName TEXT," +
                " Imagen BLOB," +
                " Content TEXT)");

        db.execSQL("CREATE TABLE Licencia(" +
                " _id INTEGER," +
                " FechaIngreso TEXT," +
                " FechaCaducidad TEXT," +
                " Estado INTEGER," +
                " IMEI TEXT," +
                " Codigo TEXT)");

        Log.i(this.getClass().toString(), "Base de datos creada");
    }

    //Recreate tables when version changes
    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // Drop older books table if existed
        db.execSQL("DROP TABLE IF EXISTS Eventos");
        db.execSQL("DROP TABLE IF EXISTS RegistroAlumno");
        db.execSQL("DROP TABLE IF EXISTS RegistroActividadScorm");
        db.execSQL("DROP TABLE IF EXISTS Noticias");
        db.execSQL("DROP TABLE IF EXISTS Licencia");
        // create fresh books table
        this.onCreate(db);
    }

    //Single SQLite connection (good practices)
    public static synchronized DbHelper getHelper(Context context) {
        if (instance == null)
            instance = new DbHelper(context);

        return instance;
    }

    //endregion
    /********************  End DB CREATION Funtions    **************/

    /********************  SCORM Funtions    **************/
    //region
    //Get Activitys from a content (take first act when finish is only true)
    public Cursor GetActivitys(String Table, String IdRegistro) {
        SQLiteDatabase db = instance.getWritableDatabase();
        Cursor cursor = db.rawQuery("select * from " + Table +
                " where IdRegistro = " + IdRegistro + " " +
                " and Name != 'initialize' " +
                " and Name != 'toc_data' " +
                " and Name != 'finish' ", null);
        cursor.moveToFirst();
        return cursor;
    }

    //Get Evaluation of an activity
    //(COUNT OF  "COMPLETED" AND "PASSED" IN TOC-DATA)/COUNT OF ACTIVITIES OF EVENT
    public int GetPorcent(String IdRegistro) {

        int completadas = 0;
        int total_activities = 0;
        SQLiteDatabase db = instance.getWritableDatabase();
        //Get count of activities
        Cursor cursor_activities = db.rawQuery("select CantAct from RegistroAlumno where _id = " + IdRegistro, null);
        cursor_activities.moveToFirst();
        total_activities = cursor_activities.getInt(0);


        //Count of passed and completed
        Cursor cursor = db.rawQuery("select ScormData from RegistroActividadScorm" +
                " where IdRegistro = " + IdRegistro +
                " and Name = 'toc_data'", null);
        cursor.moveToFirst();
        String x = cursor.getString(0);
        completadas = strUtils.GetOccurrences(cursor.getString(0), "completed");
        completadas += strUtils.GetOccurrences(cursor.getString(0), "passed");
        completadas += strUtils.GetOccurrences(cursor.getString(0), "failed");

        if (completadas > 0 && total_activities > 0) {
            return (completadas * 100) / total_activities;
        }
        return 0;

    }

    //Insert Registro Actividad
    //Main Flow of Scorm processing
    public boolean InsertRegistroActividad(String Name, String activityId, String IdRegistro, String ScormData, String version) {
        boolean Maxint = false;

        //Create or Update Scorm Register
        InsertRegistroActividadScorm(Name, ScormData, IdRegistro);

        if (Name.equals("finish")) {//if Finish
            // to validate finish only with 'true'
            if (strUtils.GetOccurrences(ScormData, "true") > 0) {
                String status = "", score = "";

                try {
                    JSONObject jsonObject = new JSONObject(ScormData);
                    String FinishActivity = jsonObject.keys().next();
                    Cursor cursor_last = GetRegistroActividadScorm(
                            FinishActivity, activityId, IdRegistro);
                    cursor_last.moveToFirst();

                    ParsedScorm parsedScormNew = new ParsedScorm(cursor_last.getString(2), version);
                    status = parsedScormNew.getCmi_completion_status();
                    score = parsedScormNew.getCmi_score_raw();
                } catch (Exception e) {

                    Cursor cursor_last = GetActivitys("RegistroActividadScorm", IdRegistro);

                    ParsedScorm parsedScormNew = new ParsedScorm(cursor_last.getString(2), version);
                    status = parsedScormNew.getCmi_success_status();
                    score = parsedScormNew.getCmi_score_raw();
                }

                //Update intents
                //IF Finish execute in the end of Activity
                if (status.equals("passed") || status.equals("failed") || !score.equals("")) {
                    Maxint = IncrementIntent(IdRegistro);
                }

                if (Maxint) {// Return If not left intent
                    return Maxint;
                } else {//if not max intent them check evaluation

                    //Update Final Situation Eval
                    if (status.equals("passed")) {
                        Update_Situation(APROBADO, IdRegistro);
                    } else if (status.equals("failed")) {
                        Update_Situation(REPROBADO, IdRegistro);
                    }

                    //Compare evaluations and modify local data in case of improvement

                    int lastEval = GetPuntaje(IdRegistro);
                    if (score.equals("")) {
                        score = "0";
                    }
                    float new_score = Float.valueOf(score);
                    if (new_score > (float) lastEval) {//if new eval is better save in local
                        SetPuntaje(IdRegistro, score);
                    }

                    //Update State of Content
                    if (GetPorcent(IdRegistro) == MaxPorcent) {
                        SetContentState(COMPLETED, IdRegistro);
                    } else {
                        SetContentState(PROGRESS, IdRegistro);
                    }

                    //Update State of Event
                    int total_contents, complete_contents, curse_contents;
                    int id_evento = GetIdEvento(IdRegistro);
                    total_contents = GetTotalContents(id_evento);
                    complete_contents = GetContentsCompleted(id_evento);
                    curse_contents = GetContentsCurse(id_evento);

                    if (complete_contents == 0 && curse_contents == 0) {
                        SetEventState(No_init, id_evento);
                    }
                    if ((total_contents > complete_contents && curse_contents != 0) || complete_contents > 0) {
                        SetEventState(En_curso, id_evento);
                    }
                    if (complete_contents == total_contents) {
                        SetEventState(Completado, id_evento);
                    }

                }
            }
        }
        return Maxint;
    }

    //Insert Scorm Register
    public void InsertRegistroActividadScorm(String Name, String ScormData, String IdRegistro) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select * from RegistroActividadScorm where IdRegistro = " + IdRegistro + " and Name = '" + Name + "'", null);
        cursor.moveToFirst();
        int exist = cursor.getCount();

        String rs = "";
        Date d = new Date();

        if (exist < 1) {//Si No existe se inserta en tabla Scorm y Tabla Local

            rs = "INSERT INTO RegistroActividadScorm" +
                    "(Name, ScormData, Modificado, IdRegistro)" +
                    " VALUES ('" + Name + "' , '" + ScormData + "', '" + d.toString() +
                    "' ," + IdRegistro + " )";
            db.execSQL(rs);

        } else {
            //Save Scorm table
            rs = "Update RegistroActividadScorm set" +
                    " ScormData = '" + ScormData +
                    "', Modificado = '" + d.toString() +
                    "' where _id =" + cursor.getInt(0);
            db.execSQL(rs);
        }

        return;
    }

    //Get Scorm Register (when is not connected)
    public Cursor GetRegistroActividadScorm(String Name, String activityId, String IdRegistro) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select * from RegistroActividadScorm " +
                "where Name = '" + Name + "' and  IdRegistro = " + IdRegistro, null);

        return cursor;
    }


    //endregion
    /********************  End SCORM Funtions    **************/

    /********************  LMS Funtions    **************/
    //region

    //Increment Intents of a evaluative content
    public boolean IncrementIntent(String IdRegistro) {
        SQLiteDatabase db = instance.getWritableDatabase();
        Cursor cursor = db.rawQuery("select Intentos, MaximoIntentos from RegistroAlumno where _id = " + IdRegistro, null);
        cursor.moveToFirst();

        if (IsMaxIntentos(IdRegistro)) {
            return true;
        } else {
            String rs = "Update RegistroAlumno" +
                    " set Intentos = " + String.valueOf(cursor.getInt(0) + 1) +
                    " where _id = " + IdRegistro;
            db.execSQL(rs);
            return false;
        }
    }

    public boolean IsMaxIntentos(String IdRegistro) {
        SQLiteDatabase db = instance.getWritableDatabase();
        Cursor cursor = db.rawQuery("select Intentos, MaximoIntentos from RegistroAlumno where _id = " + IdRegistro, null);
        cursor.moveToFirst();


        if ((cursor.getInt(0) == cursor.getInt(1)) && cursor.getInt(1) > 0) {
            return true;
        }
        return false;
    }

    public void InsertEventADistancia(int id, String Nombre, String ImagenName, String Descripcion) {

        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select * from Eventos where _id = " + id, null);

        int exist = cursor.getCount();

        if (exist < 1) {//Si No existe se inserta
            String rs = "INSERT INTO Eventos" +
                    "(_id, idEstadoEvento, idPersona, Nombre, FechaInicio, FechaTermino," +
                    " Horas, Programa, ImagenName, Imagen, Descripcion, CodigoCurso," +
                    " IdNominaEvento, IdSociedad, CodigoSence, RutOtec, ClaveOtec," +
                    " SituacionFinal, Time_to_Send, IdEstadoNomina, Activo)" +
                    " VALUES (" + id + ", " + 4 + " ,'" + 0 + "', '" + Nombre + "' , '" + null +
                    "', '" + null + "', " + null + " ,'" + null + "','" + ImagenName +
                    "'," + null + ",'" + Descripcion + "','" + null + "', " + null +
                    ", " + null + ", '" + null + "', '" + null + "', '" + null +
                    "', " + 0 + ", '" + null + "' ," + 0 + ", " + 1 + ")";

            db.execSQL(rs);
        }
    }

    public void InsertContentADistancia(
            int id, String Path, String Name, int IdEventoLMS
            , int MaximoIntentos, int Evalua, int CantAct) {

        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select * from RegistroAlumno where _id = " + id, null);

        int exist = cursor.getCount();

        if (exist < 1) {//Si No existe se inserta
            String rs = "INSERT INTO RegistroAlumno" +
                    "(_id, idAlumno, Path, Nombre, Descripcion, IdCurso, IdEventoLMS, cmi_score_raw," +
                    " TocValue, FechaInicio, FechaTermino, Estado, Resultado, " +
                    " TiempoTotal, ValorScorm, Situacion, Avance, PrimerAcceso, " +
                    " UltimoAcceso, FechaCompletacion, Intentos, MaximoIntentos, IdEstadoRegistroAlumno," +
                    " IdSituacionRegistroAlumno, IdNominaEvento, Evalua, Puntaje, CantAct, Activo)" +
                    " VALUES (" + id + ", '" + 0 + "' ,'" + Path + "','" + Name + "','" + "" +
                    "', " + null + " , " + IdEventoLMS + " , '" + null +
                    "', '" + null + "','" + null + "','" + null + "','" + 0 +
                    "', '" + null + "','" + null + "','" + null + "','" + 0 +
                    "','" + 0 + "','" + null + "','" + null + "','" + null +
                    "'," + null + "," + MaximoIntentos + "," + 0 + "," + 0 +
                    ", " + null + "," + Evalua + "," + 0 + "," + CantAct + ", " + 1 + ")";

            db.execSQL(rs);
        }
    }

    public void InsertNoticias(int id, String Name, String ImagenName, String Content) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select * from Noticias where _id = " + id, null);

        int exist = cursor.getCount();

        if (exist < 1) {//Si No existe se inserta
            String rs = "INSERT INTO Noticias" +
                    "(_id, Name, ImagenName, Imagen, Content)" +
                    " VALUES (" + id + ",'" + Name + "','" + ImagenName + "'," + null + ",'" + Content + "')";

            db.execSQL(rs);
        }
    }

    public void InsertLicencia(int id, String fechaStart, String fechaEnd, int state, String imei,String code){
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select * from Licencia where _id = " + id, null);

        int exist = cursor.getCount();

        if (exist < 1) {//Si No existe se inserta
            String rs = "INSERT INTO Licencia" +
                    "(_id, FechaIngreso, FechaCaducidad, Estado, IMEI, Codigo)" +
                    " VALUES (" + id + ",'" + fechaStart + "','" + fechaEnd + "'," + state + ",'" + imei + "','" + code + "')";

            db.execSQL(rs);
        }
    }

    //Get Licence
    public Cursor GetLicence() {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select _id, FechaIngreso, FechaCaducidad, Estado, IMEI, Codigo " +
                " from Licencia ", null);

        return cursor;
    }


    //Get News (List contents)
    public Cursor GetNews() {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select _id, Name, ImagenName, Imagen, Content " +
                " from Noticias ", null);

        return cursor;
    }

    //Get Events (List contents)
    public Cursor GetEvents(String id_persona) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select _id, Nombre, Descripcion, ImagenName, " +
                "CodigoSence, RutOtec, ClaveOtec, FechaInicio, FechaTermino, SituacionFinal, IdEstadoNomina" +
                " from Eventos where idPersona = '" + id_persona + "'" + " AND idEstadoEvento = 4 AND Activo = 1", null);

        return cursor;
    }

    //Get Contents (List contents)
    public Cursor GetContents(int id_evento, String id_alumno) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select _id, Nombre, Descripcion, Path, IdCurso, Intentos, MaximoIntentos,  " +
                "Evalua, Puntaje, IdEstadoRegistroAlumno, IdSituacionRegistroAlumno" +
                " from RegistroAlumno where IdEventoLMS = " + id_evento + " AND idAlumno = '" + id_alumno + "' AND Activo = 1", null);

        return cursor;
    }

    public Cursor GetPathContents(int id_evento, String id_alumno) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select Path" +
                " from RegistroAlumno where IdEventoLMS = " + id_evento + " AND idAlumno = '" + id_alumno + "' AND Activo = 1", null);

        return cursor;
    }

    //Get Name of Event (Title of contents)
    public String GetNameEvent(int id_evento) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select Nombre from Eventos where _id = " + id_evento, null);
        cursor.moveToFirst();
        return cursor.getString(0);
    }

    public int GetPuntaje(String id_registro) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select Puntaje from RegistroAlumno where _id = " + id_registro, null);
        cursor.moveToFirst();
        return cursor.getInt(0);
    }

    public int GetIdEvento(String id_registro) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select IdEventoLMS from RegistroAlumno where _id = " + id_registro, null);
        cursor.moveToFirst();
        return cursor.getInt(0);
    }

    public int GetTotalContents(int id_evento) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor = db.rawQuery("select count(*) from RegistroAlumno where IdEventoLMS = " + id_evento, null);

        cursor.moveToFirst();

        if (cursor.getCount() < 1) {
            return 0;
        } else {
            return cursor.getInt(0);
        }

    }

    public int GetContentsCompleted(int id_evento) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor_lect = db.rawQuery("select count(*) from RegistroAlumno where IdEventoLMS = " + id_evento +
                " and IdEstadoRegistroAlumno = 3 and Evalua = 0", null);

        cursor_lect.moveToFirst();
        int total_lect = 0;

        if (!(cursor_lect.getCount() < 1)) {
            total_lect = cursor_lect.getInt(0);
        }

        Cursor cursor_eval = db.rawQuery("select count(*) from RegistroAlumno where IdEventoLMS = " + id_evento +
                " and Evalua = 1 and IdSituacionRegistroAlumno != 0", null);

        cursor_eval.moveToFirst();
        int total_eval = 0;

        if (!(cursor_eval.getCount() < 1)) {
            total_eval = cursor_eval.getInt(0);
        }

        return total_lect + total_eval;
    }

    public int GetContentsCurse(int id_evento) {
        SQLiteDatabase db = instance.getWritableDatabase();

        Cursor cursor_lect = db.rawQuery("select count(*) from RegistroAlumno where IdEventoLMS = " + id_evento +
                " and IdEstadoRegistroAlumno = 2", null);

        cursor_lect.moveToFirst();
        int total_lect = 0;

        if (!(cursor_lect.getCount() < 1)) {
            total_lect = cursor_lect.getInt(0);
        }

        Cursor cursor_eval = db.rawQuery("select count(*) from RegistroAlumno where IdEventoLMS = " + id_evento +
                " and Evalua = 1 and IdSituacionRegistroAlumno = 0 and IdEstadoRegistroAlumno != 0 and IdEstadoRegistroAlumno != 1", null);

        cursor_eval.moveToFirst();
        int total_eval = 0;

        if (!(cursor_eval.getCount() < 1)) {
            total_eval = cursor_eval.getInt(0);
        }

        return total_lect + total_eval;
    }

    public void Update_Situation(boolean aprobado, String reg) {
        SQLiteDatabase db = instance.getWritableDatabase();
        Cursor cursor = db.rawQuery("select IdSituacionRegistroAlumno from RegistroAlumno where _id = " + reg, null);
        cursor.moveToFirst();
        int SituacionFinal = cursor.getInt(0);
        if (aprobado) {//Set aprobado
            String rs = "Update RegistroAlumno" +
                    " set IdSituacionRegistroAlumno = " + String.valueOf(1) +
                    " where _id = " + reg;
            db.execSQL(rs);
        } else if (SituacionFinal != 1 && Lastoportunity(reg)) {//Set reprobado
            String rs = "Update RegistroAlumno" +
                    " set IdSituacionRegistroAlumno = " + String.valueOf(2) +
                    " where _id = " + reg;
            db.execSQL(rs);
        }
    }

    public void SetLicence(int id, int status) {
        SQLiteDatabase db = instance.getWritableDatabase();
        String rs = "Update Licencia" +
                " set Estado = " + status +
                " where _id = " + id;
        db.execSQL(rs);
    }

    public void SetPuntaje(String reg, String puntaje) {
        SQLiteDatabase db = instance.getWritableDatabase();
        String rs = "Update RegistroAlumno" +
                " set Puntaje = " + String.valueOf(puntaje) +
                " where _id = " + reg;
        db.execSQL(rs);
    }

    public boolean Lastoportunity(String id_registro) {
        SQLiteDatabase db = instance.getWritableDatabase();
        Cursor cursor = db.rawQuery("select Intentos, MaximoIntentos from RegistroAlumno where _id = " + id_registro, null);
        cursor.moveToFirst();
        int i = cursor.getInt(0);
        int j = cursor.getInt(1);
        if (cursor.getInt(0) == cursor.getInt(1)) {
            return true;
        } else {
            return false;
        }
    }

    public void SetContentState(boolean completed, String reg) {
        SQLiteDatabase db = instance.getWritableDatabase();
        Cursor cursor = db.rawQuery("select IdEstadoRegistroAlumno from RegistroAlumno where _id = " + reg, null);
        cursor.moveToFirst();
        int IdEstadoRegistroAlumno = cursor.getInt(0);
        if (completed) {//Set COMPLETED
            String rs = "Update RegistroAlumno" +
                    " set IdEstadoRegistroAlumno = " + String.valueOf(3) +
                    " where _id = " + reg;
            db.execSQL(rs);
        } else if (IdEstadoRegistroAlumno != 3) {//if not Completed Set PROGRESS
            String rs = "Update RegistroAlumno" +
                    " set IdEstadoRegistroAlumno = " + String.valueOf(2) +
                    " where _id = " + reg;
            db.execSQL(rs);
        }
    }

    public void SetEventState(int state, int id_evento) {
        SQLiteDatabase db = instance.getWritableDatabase();
        Cursor cursor = db.rawQuery("select IdEstadoNomina from Eventos where _id = " + id_evento, null);
        cursor.moveToFirst();
        int IdEstadoNomina = cursor.getInt(0);
        if (IdEstadoNomina != 3) {//if not Completed Set PROGRESS
            String rs = "Update Eventos" +
                    " set IdEstadoNomina = " + state +
                    " where _id = " + id_evento;
            db.execSQL(rs);
        }
    }

    public int GetTotalPorcent(String IdRegistro) {

        int completadas = 0;
        int total_activities = 0;
        SQLiteDatabase db = instance.getWritableDatabase();
        //Get count of activities
        Cursor cursor_activities = db.rawQuery("select CantAct from RegistroAlumno where _id = " + IdRegistro, null);
        cursor_activities.moveToFirst();
        total_activities = cursor_activities.getInt(0);


        //Count of passed and completed
        Cursor cursor = db.rawQuery("select ScormData from RegistroActividadScorm" +
                " where IdRegistro = " + IdRegistro +
                " and Name = 'toc_data'", null);

        if (cursor.getCount()>0){
            cursor.moveToFirst();
            String x = cursor.getString(0);
            completadas = strUtils.GetOccurrences(cursor.getString(0), "completed");
            completadas += strUtils.GetOccurrences(cursor.getString(0), "passed");
            completadas += strUtils.GetOccurrences(cursor.getString(0), "failed");

        }

        if (completadas > 0 && total_activities > 0) {
            return (completadas * 100) / total_activities;
        }
        return 0;

    }



    //endregion
    /********************  End LMS Funtions    **************/

}





