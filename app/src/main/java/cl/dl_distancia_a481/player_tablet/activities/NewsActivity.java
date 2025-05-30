package cl.dl_distancia_a481.player_tablet.activities;
/**
 * Created by fcollado on 12-21-19.
 */

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.database.Cursor;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.GridLayoutManager;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;


import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;


import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.adapters.ListNewsAdapter;
import cl.dl_distancia_a481.player_tablet.recycler.classes.ListNews;

import cl.dl_distancia_a481.player_tablet.recycler.classes.News;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;
import cl.dl_distancia_a481.player_tablet.utils.ExcelLib;

public class NewsActivity extends BaseActivity {

    ListNews news = new ListNews();
    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;


    private DbHelper dbHelper;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FrameLayout contentFrameLayout = findViewById(R.id.content_frame); //Remember this is the FrameLayout area within your activity_main.xml        getLayoutInflater().inflate(R.layout.activity_main, contentFrameLayout);
        getLayoutInflater().inflate(R.layout.activity_news_list, contentFrameLayout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.getMenu().getItem(2).setChecked(true);


        mRecyclerView = findViewById(R.id.news_recycler_view);
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);

        dbHelper = DbHelper.getHelper(this);

        ExcelLib excel = new ExcelLib(this);
        excel.ReadExcel();

        changeLayout();

    }

    public void CompleteList() {
        String Name, Content, ImagenName;
        int id;
        int i = 0;
        ArrayList<News> News = new ArrayList<>();

        Cursor cursor = dbHelper.GetNews();
        if (cursor.moveToFirst()) {
            do {
                id = cursor.getInt(0);
                Name = cursor.getString(1);
                ImagenName = cursor.getString(2);
                Content = cursor.getString(4);
                News news = new News(id, Name, Content, ImagenName);

                News.add(news);
                i++;
            } while (cursor.moveToNext());
        }

        if (cursor.getCount() > 0) {

            //Setting RecyclerViewAdapter
            mAdapter = new ListNewsAdapter(NewsActivity.this, News);
            mRecyclerView.setAdapter(mAdapter);
            mRecyclerView.setVisibility(View.VISIBLE);

        }

    }


    @Override
    public void onBackPressed() {
        Bundle b = new Bundle();
        final Intent intent = new Intent(NewsActivity.this, DashboardActivity.class);
        intent.putExtras(b);
        startActivity(intent);
    }

    private void changeLayout() {
        if(getResources().getConfiguration().orientation == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT){
            mRecyclerView.setHasFixedSize(true);

            mLayoutManager = new LinearLayoutManager(getBaseContext());
            mRecyclerView.setLayoutManager(mLayoutManager);
            // specify an adapter and pass in our data model list
            mAdapter = new ListNewsAdapter(this, news.getNewsList());
            mRecyclerView.setAdapter(mAdapter);

            CompleteList();
        }else {
            // use this setting to improve performance if you know that changes
            // in content do not change the layout size of the RecyclerView
            mRecyclerView.setHasFixedSize(true);
            // use a linear layout manager
            mLayoutManager = new GridLayoutManager(getBaseContext(), 2);
            mRecyclerView.setLayoutManager(mLayoutManager);
            // specify an adapter and pass in our data model list
            mAdapter = new ListNewsAdapter(this, news.getNewsList());
            mRecyclerView.setAdapter(mAdapter);

            CompleteList();
        }
    }


}
