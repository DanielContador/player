package cl.dl_distancia_a481.player_tablet.activities;


import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.navigation.NavigationView;

import java.io.IOException;
import java.util.ArrayList;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.adapters.DocListAdapter;

public class BiblioActivity extends BaseActivity {
    private final ArrayList<String> pdfList = new ArrayList<>();
    private RecyclerView mRecyclerView;
    private DocListAdapter mAdapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout contentFrameLayout = findViewById(R.id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml        getLayoutInflater().inflate(R.layout.activity_main, contentFrameLayout);
        getLayoutInflater().inflate(R.layout.activity_biblio, contentFrameLayout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.getMenu().getItem(3).setChecked(true);


        listAssetFiles("config");
        // Create recycler view.
        mRecyclerView = findViewById(R.id.pdfList);
        // Create an adapter and supply the data to be displayed.
        mAdapter = new DocListAdapter(this,pdfList);
        // Connect the adapter with the recycler view.
        mRecyclerView.setAdapter(mAdapter);
        // Give the recycler view a default layout manager.
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        mRecyclerView.setItemAnimator(new DefaultItemAnimator());

        RelativeLayout helpDesk = findViewById(R.id.helpDeskBton);
        helpDesk.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getBaseContext(), MesaAyudaActivity.class);
                startActivity(intent);
            }
        });
    }


    private boolean listAssetFiles(String path) {

        String [] list;
        try {
            list = getAssets().list(path);
            if (list.length > 0) {
                // This is a folder
                for (String file : list) {
                    if (!listAssetFiles(path + "/" + file))
                        return false;
                    else if(file.endsWith(".pdf")){
                        // This is a file
                        // TODO: add file name to an array list
                        String[] parts = file.split(".pdf");
                        String url = parts[0];
                        pdfList.add(url);
                    }
                }
            }
        } catch (IOException e) {
            return false;
        }

        return true;
    }
}
