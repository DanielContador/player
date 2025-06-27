package cl.dl_distancia_a481.player_tablet.activities;

import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.util.TypedValue;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.util.ArrayList;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.adapters.ListContentsAdapter;
import cl.dl_distancia_a481.player_tablet.recycler.classes.Content;
import cl.dl_distancia_a481.player_tablet.recycler.decoration.DividerItemDecoration;
import cl.dl_distancia_a481.player_tablet.utils.CustomDialogClass;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;

//Activity to show contents associated to a curse
public class ContentsActivity extends AppCompatActivity {

    private String CodigoSence;
    private int IdEvento;
    private Context context;
    private SwipeRefreshLayout swipeRefreshLayout;
    private RecyclerView recyclerView;
    private RecyclerView.Adapter recyclerViewAdapter;
    private DbHelper dbHelper;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contents);
        context = this;

        Bundle b = this.getIntent().getExtras();

        // Data Received from EventsActivity
        CodigoSence = b.getString("CodigoSence");
        IdEvento = b.getInt("id");

        //Init BD Object
        dbHelper = DbHelper.getHelper(this);

        //Setting UI components
        SetUI();


        // Setup swipe to refresh activity from DB
        swipeToRefresh();
    }


    //Setting UI components
    private void SetUI(){
        //Show CallCenter
        Button btn_help = findViewById(R.id.btn_ayuda);
        btn_help.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                CustomDialogClass cdd = new CustomDialogClass(ContentsActivity.this);
                cdd.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                cdd.show();
            }
        });

        //Set title bar
        TextView t =  findViewById(R.id.toolbar_title_cont);
        DbHelper db = new DbHelper(this);
        String title = db.GetNameEvent(IdEvento);
        t.setText(title);

        //Setting recyclerView
        recyclerViewDesign();
    }

    //Setting recyclerView with ContentItem
    private void recyclerViewDesign() {

        recyclerView = findViewById(R.id.recyclerContents);

        // Divider
        recyclerView.addItemDecoration(new DividerItemDecoration(getResources().getDrawable(android.R.drawable.divider_horizontal_bright)));

        // improve performance if you know that changes in content
        // do not change the size of the RecyclerView
        recyclerView.setHasFixedSize(true);

        // use a linear layout manager
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getBaseContext());
        recyclerView.setLayoutManager(linearLayoutManager);
        recyclerView.setItemAnimator(new DefaultItemAnimator());

        CompleteList();
    }

    //Get content from DB and passing to Recycler
    public void CompleteList(){
        String Name,Descripcion, Path;
        int id,id_curso, intentos, maxintentos,evalua, Puntaje, estado_contenido, situacion_final;
        int i = 0;
        boolean puede = true;
        ArrayList<Content> Contents = new ArrayList<Content>();

        //Get Contents from DB
        Cursor cursor = dbHelper.GetContents(IdEvento, "0");
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
                if (maxintentos > 0 ){
                    puede = intentos < maxintentos;
                }
                Content content = new Content(id, IdEvento, Name, Descripcion,Path, id_curso,
                         CodigoSence, puede, evalua,intentos, maxintentos, Puntaje, estado_contenido, situacion_final);
                puede = true;
                Contents.add(content);
                i++;
            } while (cursor.moveToNext());
        }

        //Setting RecyclerViewAdapter
        recyclerViewAdapter = new ListContentsAdapter(this, Contents);
        recyclerView.setAdapter(recyclerViewAdapter);

        //Finalized refresh
        swipeRefreshLayout = findViewById(R.id.swipe_container);
        swipeRefreshLayout.setRefreshing(false);

    }

    //Jump always to EventsActivity
    @Override
    public void onBackPressed() {
        Bundle b = new Bundle();
        Intent intent = new Intent(ContentsActivity.this, EventsActivity.class);
        intent.putExtras(b);
        startActivity(intent);
    }

    //Refresh Activity
    private void swipeToRefresh() {
        swipeRefreshLayout = findViewById(R.id.swipe_container);
        TypedValue typedValueColorPrimary = new TypedValue();
        TypedValue typedValueColorAccent = new TypedValue();
        this.getTheme().resolveAttribute(R.attr.colorPrimary, typedValueColorPrimary, true);
        this.getTheme().resolveAttribute(R.attr.colorAccent, typedValueColorAccent, true);
        swipeRefreshLayout.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                CompleteList();
            }
        });
    }

}