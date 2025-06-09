package cl.dl_distancia_a481.player_tablet.activities;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.navigation.NavigationView;

import org.json.JSONException;
import org.json.JSONObject;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.adapters.ListItemTocAdapter;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;
import cl.dl_distancia_a481.player_tablet.utils.Scorm;
import cl.dl_distancia_a481.player_tablet.utils.TocPlayer;
import cl.dl_distancia_a481.player_tablet.utils.XmlParse;

public class TocActivity extends BaseActivity {

    TocPlayer toc = new TocPlayer();
    private RecyclerView recyclerView;
    private RecyclerView.Adapter recyclerViewAdapter;
    String strstatus;

    private int Id_content, Id_event, Id_curso, Is_eval, Progreso, Number;
    private String Path;
    Context context;
    String CodigoSence;
    Bundle bundle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FrameLayout contentFrameLayout = findViewById(R.id.content_frame); // Remember this is the FrameLayout area
                                                                           // within your activity_main.xml
                                                                           // getLayoutInflater().inflate(R.layout.activity_main,
                                                                           // contentFrameLayout);
        getLayoutInflater().inflate(R.layout.activity_toc, contentFrameLayout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.getMenu().getItem(1).setChecked(true);
        // getWindow().getDecorView().setBackgroundColor(Color.LTGRAY);
        context = this;

        GetReceiveData();

        CheckIntents();

        GetManifest();

        GetCurseStatus();

        SetUI();
        RelativeLayout helpDesk = findViewById(R.id.helpDeskBton);
        helpDesk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getBaseContext(), MesaAyudaActivity.class);
                startActivity(intent);
            }
        });
    }

    public void GetReceiveData() {
        bundle = this.getIntent().getExtras();

        CodigoSence = bundle.getString("CodigoSence");
        Id_content = bundle.getInt("IdContent");
        Id_event = bundle.getInt("IdEvent");
        Path = bundle.getString("Path");
        Id_curso = bundle.getInt("IdCurso");
        Is_eval = bundle.getInt("isEval");
        Progreso = bundle.getInt("Progreso", 0);
        Number = bundle.getInt("Number", 0);
    }

    public void CheckIntents() {
        DbHelper dbHelper = new DbHelper(this);

        if (Is_eval == 1 && dbHelper.IsMaxIntentos(String.valueOf(Id_content))) {
            Toast.makeText(this, "A alcanzado el máximo número de intentos", Toast.LENGTH_LONG);
            Finish_Course();
        }
    }

    public void GetManifest() {
        XmlParse xmlparse = new XmlParse(this, Path);
        toc = xmlparse.GetToc();
    }

    public void GetCurseStatus() {
        JSONObject status = new JSONObject();
        // Scorm scorm = new Scorm(this);
        // String strStatus = scorm.getScorm("toc_data", "1",
        // String.valueOf(Id_content));
        GetTask gtask = new GetTask();
        gtask.execute();
        try {
            gtask.get();
        } catch (Exception e) {
            e.printStackTrace();
        }
        String strStatus = strstatus;

        try {// {"aryCompletionStatus":{"ITEM-866AD0AAC6BFB7DE0840390AB7A3BDA1":"incomplete","ITEM-16C3FA358A56B1C1B6BA9D7C8CF3C415":"incomplete"}}
            JSONObject json = new JSONObject(strStatus);
            status = new JSONObject(json.getString("aryCompletionStatus"));
        } catch (JSONException e) {
            Log.d("Get Status", e.toString());
        }

        for (int i = 0; i < toc.getItems().size(); i++) {
            try {
                String new_state = status.getString(toc.getItems().get(i).identifier);
                toc.getItems().get(i).state = status.getString(toc.getItems().get(i).identifier);
            } catch (JSONException e) {
                Log.d("Get individual Status", e.toString());
            }
        }
    }

    // Setting UI components
    private void SetUI() {

        // TextView txtorganization = findViewById(R.id.txtorganization);
        // txtorganization.setText(toc.getOrganization());

        // Setting recyclerView
        recyclerViewDesign();
    }

    // Setting recyclerView with ContentItem
    private void recyclerViewDesign() {

        recyclerView = findViewById(R.id.recyclertocitems);

        // improve performance if you know that changes in content
        // do not change the size of the RecyclerView
        recyclerView.setHasFixedSize(true);

        // use a linear layout manager
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(getBaseContext());
        recyclerView.setLayoutManager(linearLayoutManager);
        recyclerView.setItemAnimator(new DefaultItemAnimator());

        CompleteList();
    }

    // Get content from DB and passing to Recycler
    public void CompleteList() {
        // Setting RecyclerViewAdapter
        recyclerViewAdapter = new ListItemTocAdapter(this, toc.getItems(), bundle);
        recyclerView.setAdapter(recyclerViewAdapter);
    }

    // Finish_Course
    @Override
    protected void onDestroy() {
        Finish_Course();
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        Finish_Course();
    }

    // When finish a content and press back
    public void Finish_Course() {
        Log.d(">>>", "Finish_Course");

        Bundle b = new Bundle();
        b.putString("CodigoSence", CodigoSence);
        b.putInt("id", Id_event);
        final Intent intent = new Intent(TocActivity.this, EventsActivity.class);
        intent.putExtras(b);

        // Go back to content activity when pass 1 sec
        // Wait for player finish and DB actualized
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                // Do something after 1000ms
                startActivity(intent);
            }
        }, 1000);

    }

    public class GetTask extends AsyncTask<Void, Void, Boolean> {

        @Override
        protected Boolean doInBackground(Void... param) {
            Scorm scorm = new Scorm(context);
            strstatus = scorm.getScorm("toc_data", "1", String.valueOf(Id_content));
            return true;
        }
    }

}
