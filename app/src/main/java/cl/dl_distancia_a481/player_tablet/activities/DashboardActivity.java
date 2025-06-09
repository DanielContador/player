package cl.dl_distancia_a481.player_tablet.activities;

/**
 * Created by fcollado on 01-15-20.
 */
import android.text.Html;
import cl.dl_distancia_a481.player_tablet.AppState;

import androidx.core.text.HtmlCompat;
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
import com.google.android.material.navigation.NavigationView;
import java.io.IOException;
import java.util.ArrayList;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.classes.News;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;

public class DashboardActivity extends BaseActivity {

    private DbHelper dbHelper;
    Context context;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FrameLayout contentFrameLayout = findViewById(R.id.content_frame); // Remember this is the FrameLayout area
                                                                           // within your activity_main.xml
                                                                           // getLayoutInflater().inflate(R.layout.activity_main,
                                                                           // contentFrameLayout);
        getLayoutInflater().inflate(R.layout.content_main, contentFrameLayout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.getMenu().getItem(0).setChecked(true);

        context = this;
        dbHelper = DbHelper.getHelper(this);
        // Dentro de onCreate() o donde inicialices tu vista:
        TextView tv = findViewById(R.id.textViewItemTitle);
        tv.setText(HtmlCompat.fromHtml(
                getString(R.string.title_training),
                HtmlCompat.FROM_HTML_MODE_LEGACY));
        // get the buttons
        RelativeLayout biblio = findViewById(R.id.biblioBton);
        RelativeLayout news = findViewById(R.id.newsBton);
        RelativeLayout video = findViewById(R.id.videoView);
        // check for conditions to turn off and on the buttons
        boolean checkForBiblio = checkForBibliotecaInDashboard("config");
        if (checkForBiblio) {
            biblio.setVisibility(View.INVISIBLE);
            Menu nav_Menu = navigationView.getMenu();
            nav_Menu.findItem(R.id.nav_biblio).setVisible(false);
        }
        boolean checkForVideo = checkVideoInDashboard("");
        if (checkForVideo)
            video.setVisibility(View.INVISIBLE);
        boolean checkForNews = checkNewsInDashboard();
        if (checkForNews) {
            news.setVisibility(View.INVISIBLE);
            Menu nav_Menu = navigationView.getMenu();
            nav_Menu.findItem(R.id.nav_news).setVisible(false);
        }
        ProgressBar gauge = findViewById(R.id.totalProgressBar);
        TextView percent = findViewById(R.id.totalProgress);
        int num = calculatePercent();
        percent.setText(num + "%");
        gauge.setProgress(num);
        RelativeLayout mainBton = findViewById(R.id.item_activity);
        if (num == 100)
            mainBton.setBackground(getResources().getDrawable(R.drawable.ic_background_mainbton_completed));

        mainBton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getBaseContext(), EventsActivity.class); // O la actividad que corresponda
                startActivity(intent);
            }
        });
        news.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getBaseContext(), NewsActivity.class);
                startActivity(intent);
            }
        });

        video.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showAlert();
            }
        });

        biblio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getBaseContext(), BiblioActivity.class);
                startActivity(intent);
            }
        });

        // Agregar lógica para frame_1
        RelativeLayout frame1 = findViewById(R.id.frame_1);
        frame1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getBaseContext(), EventsActivity.class);
                startActivity(intent);
            }
        });

        // Agregar lógica para btn_ir_a_otros
        View btnIrAOtros = findViewById(R.id.btn_ir_a_otros);
        if (btnIrAOtros != null) {
            btnIrAOtros.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(getBaseContext(), EventsActivity.class);
                    startActivity(intent);
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
        // String videoPath = "android.resource://" + getPackageName() + "/" +
        // R.raw.video;
        videoView.setVideoPath("content://cl.dl_distancia_a481.player_tablet.activities/video.mp4");
        // Uri uri = Uri.parse(videoPath);
        // videoView.setVideoURI(uri);
        videoView.start();

        MediaController mediaController = new MediaController(this);
        videoView.setMediaController(mediaController);
        mediaController.setAnchorView(videoView);
        videoView.setZOrderOnTop(true);
        AlertDialog.Builder alertDialogBuilder = new AlertDialog.Builder(this);
        alertDialogBuilder.setView(videoView);
        alertDialogBuilder.setTitle("Nombre del video");
        alertDialogBuilder.setNegativeButton("Salir", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
            }
        });
        AlertDialog alertDialog = alertDialogBuilder.create();
        alertDialog.show();
    }

    @Override
    public void onBackPressed() {
        // super.onBackPressed();
        return;
    }

    public int calculatePercent() {
        int pertcentTotal = 0;
        int cantCursos = 0;
        Cursor cursorCont = null;
        Cursor cursor = dbHelper.GetEvents("0");
        if (cursor.moveToFirst()) {
            do {
                cursorCont = dbHelper.GetContents(cursor.getInt(0), "0");
                if (cursorCont.moveToFirst()) {
                    do {
                        pertcentTotal += dbHelper.GetTotalPorcent(cursorCont.getString(0));
                    } while (cursorCont.moveToNext());
                    cantCursos += cursorCont.getCount();
                }

            } while (cursor.moveToNext());
        }

        return pertcentTotal / cantCursos;
    }

    // Check for components
    public boolean checkForBibliotecaInDashboard(String path) {
        String[] list;
        try {
            list = getAssets().list(path);

            if (list.length > 0) {
                // This is a folder
                for (String file : list) {
                    if (!checkForBibliotecaInDashboard(path + "/" + file))
                        return false;
                    else if (file.endsWith(".pdf")) {
                        return false;
                    }
                }
            }
        } catch (IOException e) {
            return false;
        }
        return true;
    }

    public boolean checkVideoInDashboard(String path) {
        String[] list;
        try {
            list = getAssets().list(path);

            if (list.length > 0) {
                for (String file : list) {
                    if (!checkVideoInDashboard(path + "/" + file))
                        return false;
                    else if (file.endsWith(".mp4")) {
                        return false;
                    }
                }
            }
        } catch (IOException e) {
            return false;
        }
        return true;
    }

    public boolean checkNewsInDashboard() {
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

            return false;

        }
        return true;
    }

}
