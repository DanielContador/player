package cl.dl_distancia_a481.player_tablet.activities;

import android.content.Context;

import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;

import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.util.Log;

import android.view.View;
import android.view.WindowManager;

import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.google.android.material.navigation.NavigationView;


import java.io.File;

import java.util.ArrayList;
import java.util.Arrays;

import java.util.Timer;


import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.adapters.ListCursesAdapter;
import cl.dl_distancia_a481.player_tablet.recycler.classes.Content;
import cl.dl_distancia_a481.player_tablet.recycler.classes.Event;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;
import cl.dl_distancia_a481.player_tablet.utils.SenceOtec;

public class EventsActivity extends BaseActivity {
    Context context;
    public Timer timer;
    RecyclerView recyclerView;
    RecyclerView.Adapter recyclerViewAdapter;
    private DbHelper dbHelper;
    private ArrayList<Event> Events = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout contentFrameLayout = findViewById(R.id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml        getLayoutInflater().inflate(R.layout.activity_main, contentFrameLayout);
        getLayoutInflater().inflate(R.layout.activity_events, contentFrameLayout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.getMenu().getItem(1).setChecked(true);

        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
        context = this;


        //Init BD Object
        dbHelper = DbHelper.getHelper(this);

        //Setting UI components
        SetUI();

        //Load Data
        //ExcelLib excel = new ExcelLib(this);
        //excel.ReadExcel();

        CompleteList();

    }

    //Setting UI components
    public void SetUI() {


        recyclerViewDesign();
    }

    private void recyclerViewDesign() {

        recyclerView = findViewById(R.id.recyclerEvents);

        // Divider
        //recyclerView.addItemDecoration(new DividerItemDecoration(getResources().getDrawable(android.R.drawable.divider_horizontal_bright)));

        // improve performance if you know that changes in content
        // do not change the size of the RecyclerView
        recyclerView.setHasFixedSize(true);

        // use a linear layout manager
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getBaseContext());
        recyclerView.setLayoutManager(linearLayoutManager);
        recyclerView.setItemAnimator(new DefaultItemAnimator());


    }

    public void CompleteList() {
        String Name, Descripcion, CodigoSence, RutOtect, ClaveOtec, FechaInicio, FechaTermino, ImagenName;
        SenceOtec so;
        int id, Situacion_final, Estado_nomina;
        int i = 0;


        Cursor cursor = dbHelper.GetEvents("0");
        if (cursor.moveToFirst()) {
            do {
                id = cursor.getInt(0);
                Name = cursor.getString(1);
                Descripcion = cursor.getString(2);
                ImagenName = cursor.getString(3);
                CodigoSence = cursor.getString(4);
                RutOtect = cursor.getString(5);
                ClaveOtec = cursor.getString(6);
                FechaInicio = cursor.getString(7).split("T")[0];
                FechaTermino = cursor.getString(8).split("T")[0];
                Situacion_final = cursor.getInt(9);
                Estado_nomina = cursor.getInt(10);
                so = new SenceOtec(CodigoSence, RutOtect, ClaveOtec);

                Event event = new Event(id, Name, Descripcion, ImagenName, so, FechaInicio, FechaTermino, Situacion_final, Estado_nomina);
                ArrayList<Content> cont = getContents(event);
                Event event2 = new Event(id, Name, Descripcion, ImagenName, so, FechaInicio, FechaTermino, Situacion_final, Estado_nomina, cont);
                //Add Event to List if Contain All Courses
                if (ContainEvent(id, "0")) {
                    Events.add(event2);
                }

                i++;
            } while (cursor.moveToNext());
        }

        if (cursor.getCount() > 0) {

            //Get new events first
            //Collections.reverse(Events);

            //Setting RecyclerViewAdapter
            recyclerViewAdapter = new ListCursesAdapter(EventsActivity.this, Events, false);
            recyclerView.setAdapter(recyclerViewAdapter);
            recyclerView.setVisibility(View.VISIBLE);


            //Hide text for empty events for at least one event
            TextView txt_empty = findViewById(R.id.empty_events);
            txt_empty.setVisibility(View.GONE);
        } else {
            //Show text for empty events
            recyclerView.setVisibility(View.GONE);
            TextView txt_empty = findViewById(R.id.empty_events);
            txt_empty.setVisibility(View.VISIBLE);
        }

    }

    private boolean ContainEvent(int IdEvento, String id_persona) {

        DbHelper dbHelper = DbHelper.getHelper(this);

        Cursor cursor = dbHelper.GetPathContents(IdEvento, id_persona);

        String path;
        if (cursor.getCount() > 0) {
            try {
                if (cursor.moveToFirst()) {
                    String[] files = getAssets().list("www" + File.separator + "player" + File.separator + "courses");
                    do {
                        path = cursor.getString(0);
                        if (!Arrays.asList(files).contains(path)) {
                            return false;
                        }
                    } while (cursor.moveToNext());
                }
            } catch (Exception e) {
                Log.e("Error check contain", e.getMessage());
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent(getBaseContext(), DashboardActivity.class);
        startActivity(intent);
    }

    public ArrayList<Content> getContents(Event event) {
        String Name, Descripcion, Path;
        int id, id_curso, intentos, maxintentos, evalua, Puntaje, estado_contenido, situacion_final;
        int i = 0;
        boolean puede = true;
        ArrayList<Content> Contents = new ArrayList<Content>();

        //Get Contents from DB
        Cursor cursor = dbHelper.GetContents(event.getid(), "0");
        if (cursor.moveToFirst()) {
            do {
                id = cursor.getInt(0);
                Name = cursor.getString(1);
                Descripcion = cursor.getString(2);
                Path = cursor.getString(3);
                id_curso = cursor.getInt(4);
                intentos = cursor.getInt(5);
                maxintentos = cursor.getInt(6);
                evalua = cursor.getInt(7);
                Puntaje = cursor.getInt(8);
                estado_contenido = cursor.getInt(9);
                situacion_final = cursor.getInt(10);
                if (maxintentos > 0) {
                    puede = intentos < maxintentos;
                }
                Content content = new Content(id, event.getid(), Name, Descripcion, Path, id_curso,
                        event.getSenceOtec().getCodigoSence(), puede, evalua, intentos, maxintentos, Puntaje, estado_contenido, situacion_final);
                puede = true;
                Contents.add(content);
                i++;
            } while (cursor.moveToNext());
        }
        return Contents;

    }

}


