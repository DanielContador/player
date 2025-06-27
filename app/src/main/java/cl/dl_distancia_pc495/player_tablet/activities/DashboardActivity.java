package cl.dl_distancia_a481.player_tablet.activities;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.MediaController;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.VideoView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.text.HtmlCompat;

import com.google.android.material.navigation.NavigationView;

import java.io.IOException;
import java.util.ArrayList;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.activities.BaseActivity;
import cl.dl_distancia_a481.player_tablet.recycler.classes.News;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;
import cl.dl_distancia_a481.player_tablet.AppState;

public class DashboardActivity extends BaseActivity {

    private DbHelper dbHelper;
    private Context context;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Inflate the dashboard layout into the content frame
        FrameLayout contentFrame = findViewById(R.id.content_frame);
        getLayoutInflater().inflate(R.layout.content_main, contentFrame);

        // Highlight the selected item in the navigation drawer
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.getMenu().getItem(0).setChecked(true);

        context = this;
        dbHelper = DbHelper.getHelper(this);

        // Initialize buttons
        RelativeLayout biblio = findViewById(R.id.biblioBton);
        RelativeLayout news = findViewById(R.id.newsBton);
        RelativeLayout video = findViewById(R.id.videoView);

        // Conditionally hide buttons and menu items
        if (checkForBibliotecaInDashboard("config")) {
            biblio.setVisibility(View.INVISIBLE);
            Menu navMenu = navigationView.getMenu();
            navMenu.findItem(R.id.nav_biblio).setVisible(false);
        }
        if (checkVideoInDashboard("")) {
            video.setVisibility(View.INVISIBLE);
        }
        if (checkNewsInDashboard()) {
            news.setVisibility(View.INVISIBLE);
            Menu navMenu = navigationView.getMenu();
            navMenu.findItem(R.id.nav_news).setVisible(false);
        }

        // Update progress bar and percentage text
        ProgressBar gauge = findViewById(R.id.totalProgressBar);
        TextView percent = findViewById(R.id.totalProgress);
        int progressValue = calculatePercent();
        percent.setText(progressValue + "%");
        gauge.setProgress(progressValue);

        // Main card container click listener
        ConstraintLayout mainCard = findViewById(R.id.card_container);
        if (progressValue == 100) {
            mainCard.setBackground(getResources().getDrawable(R.drawable.ic_background_mainbton_completed));
        }
        mainCard.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent;
                if (AppState.goToCombinedCourses) {
                    intent = new Intent(getBaseContext(), CombinedCoursesActivity.class);
                } else {
                    intent = new Intent(getBaseContext(), EventsActivity.class);
                }
                startActivity(intent);
                v.setPressed(false);
                v.post(() -> v.jumpDrawablesToCurrentState());
            }
        });

        // Separate frame_1 "Comenzar" button click
        FrameLayout frame1 = findViewById(R.id.frame_1);
        frame1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent;
                if (AppState.goToCombinedCourses) {
                    intent = new Intent(getBaseContext(), CombinedCoursesActivity.class);
                } else {
                    intent = new Intent(getBaseContext(), EventsActivity.class);
                }
                startActivity(intent);
                v.setPressed(false);
                v.post(() -> v.jumpDrawablesToCurrentState());
            }
        });

        // News button click
        news.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(getBaseContext(), NewsActivity.class));
            }
        });

        // Video button click
        video.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showAlert();
            }
        });

        // Biblioteca button click
        biblio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(getBaseContext(), BiblioActivity.class));
            }
        });

        // Optional "otros" button click if present
        View btnOtros = findViewById(R.id.btn_ir_a_otros);
        if (btnOtros != null) {
            btnOtros.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent;
                    if (AppState.goToCombinedCourses) {
                        intent = new Intent(getBaseContext(), CombinedCoursesActivity.class);
                    } else {
                        intent = new Intent(getBaseContext(), EventsActivity.class);
                    }
                    startActivity(intent);
                    v.setPressed(false);
                    v.post(() -> v.jumpDrawablesToCurrentState());
                }
            });
        }
    }

    @Override
    protected void onResume() {
        AppState.currentActivityClass = DashboardActivity.class;
        super.onResume();
    }

    public void showAlert() {
        VideoView videoView = new VideoView(this);
        videoView.setVideoPath("content://cl.dl_distancia_a481.player_tablet.activities/video.mp4");
        videoView.start();

        MediaController mediaController = new MediaController(this);
        videoView.setMediaController(mediaController);
        mediaController.setAnchorView(videoView);
        videoView.setZOrderOnTop(true);

        AlertDialog alert = new AlertDialog.Builder(this)
                .setTitle("Nombre del video")
                .setView(videoView)
                .setNegativeButton("Salir", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.dismiss();
                    }
                })
                .create();
        alert.show();
    }

    @Override
    public void onBackPressed() {
        // Disable back button
    }

    public int calculatePercent() {
        int totalPercent = 0;
        int courseCount = 0;
        Cursor cursor = dbHelper.GetEvents("0");
        if (cursor.moveToFirst()) {
            do {
                Cursor contents = dbHelper.GetContents(cursor.getInt(0), "0");
                if (contents.moveToFirst()) {
                    do {
                        totalPercent += dbHelper.GetTotalPorcent(contents.getString(0));
                    } while (contents.moveToNext());
                    courseCount += contents.getCount();
                }
            } while (cursor.moveToNext());
        }
        return courseCount > 0 ? totalPercent / courseCount : 0;
    }

    public boolean checkForBibliotecaInDashboard(String path) {
        try {
            String[] list = getAssets().list(path);
            if (list.length > 0) {
                for (String file : list) {
                    if (!checkForBibliotecaInDashboard(path + "/" + file))
                        return false;
                    if (file.endsWith(".pdf"))
                        return false;
                }
            }
        } catch (IOException e) {
            return false;
        }
        return true;
    }

    public boolean checkVideoInDashboard(String path) {
        try {
            String[] list = getAssets().list(path);
            if (list.length > 0) {
                for (String file : list) {
                    if (!checkVideoInDashboard(path + "/" + file))
                        return false;
                    if (file.endsWith(".mp4"))
                        return false;
                }
            }
        } catch (IOException e) {
            return false;
        }
        return true;
    }

    public boolean checkNewsInDashboard() {
        ArrayList<News> newsList = new ArrayList<>();
        Cursor cursor = dbHelper.GetNews();
        if (cursor.moveToFirst()) {
            do {
                newsList.add(new News(
                        cursor.getInt(0),
                        cursor.getString(1),
                        cursor.getString(4),
                        cursor.getString(2)));
            } while (cursor.moveToNext());
        }
        cursor.close();
        return newsList.isEmpty();
    }
}
