package cl.dl_distancia_a481.player_tablet.activities;


 import android.graphics.drawable.ColorDrawable;
import android.graphics.Color;
import android.view.Window;
import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import android.widget.ImageButton;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.app.Dialog;
import android.view.Window;
import android.widget.TextView;
import android.widget.ImageView;


import com.google.android.material.navigation.NavigationView;

import java.io.IOException;
import java.util.ArrayList;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.classes.News;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;

public class BaseActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {
    DrawerLayout drawerLayout;
    ActionBarDrawerToggle actionBarDrawerToggle;
    Toolbar toolbar;
    private DbHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_base);
        NavigationView navigationView = findViewById(R.id.nav_view);
        dbHelper = DbHelper.getHelper(this);
        toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        drawerLayout = findViewById(R.id.drawer_layout);

        // Solo la lógica de abrir el drawer con btnMenu
        ImageButton btnMenu = findViewById(R.id.btnMenu);
        if (btnMenu != null && drawerLayout != null) {
            btnMenu.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    drawerLayout.openDrawer(GravityCompat.START);
                }
            });
        }

        // Lógica para navegar a DashboardActivity al presionar btnHome
        ImageButton btnHome = findViewById(R.id.btnHome);
        if (btnHome != null) {
            btnHome.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(getBaseContext(), DashboardActivity.class);
                    startActivity(intent);
                }
            });
        }

        // Deshabilita el gesto de abrir el drawer desde el borde
        if (drawerLayout != null) {
            drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
        }

        actionBarDrawerToggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        if (drawerLayout != null) {
            drawerLayout.addDrawerListener(actionBarDrawerToggle);
        }
        actionBarDrawerToggle.syncState();

        if (navigationView != null) {
            navigationView.setNavigationItemSelectedListener(this);
        }

        //check for conditions to turn off and on the buttons
        boolean checkBiblio = checkForBiblioteca("config");
        if (checkBiblio){
            Menu nav_Menu = navigationView.getMenu();
            nav_Menu.findItem(R.id.nav_biblio).setVisible(false);
        }
        boolean checkNews = checkNews();
        if (checkNews){
            Menu nav_Menu = navigationView.getMenu();
            nav_Menu.findItem(R.id.nav_news).setVisible(false);
        }


        ImageButton helpTop = findViewById(R.id.helptop);
        helpTop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showHelpTopDialog();
            }
        });

        ImageButton btnMenuInfo = findViewById(R.id.btnMenuInfo);
        if (btnMenuInfo != null) {
            btnMenuInfo.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(getBaseContext(), MesaAyudaActivity.class);
                    startActivity(intent);
                }
            });
        }
    }

    private void showHelpTopDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_helptop);
    Window window = dialog.getWindow();
    if (window != null) {
        window.setBackgroundDrawable(
                new ColorDrawable(android.graphics.Color.TRANSPARENT)
        );
    }

        ImageView closeBtn = dialog.findViewById(R.id.dialog_close);
        closeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        // Cambiar a R.id.soporte
        TextView textView = dialog.findViewById(R.id.soporte);
        textView.setText("Soporte");

        dialog.show();
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        actionBarDrawerToggle.syncState();
    }



    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        // Handle navigation view item clicks here.
        switch (menuItem.getItemId()) {
            case R.id.nav_home:
                drawer.closeDrawer(GravityCompat.START);
                startActivityDashboard();
                return true;
            case R.id.nav_learning:
                drawer.closeDrawer(GravityCompat.START);
                startActivityEvents();
                return true;
            case R.id.nav_news:
                drawer.closeDrawer(GravityCompat.START);
                startActivityNews();
                return true;
            case R.id.nav_biblio:
                drawer.closeDrawer(GravityCompat.START);
                startActivityBiblio();
                return true;
            case R.id.nav_help:
                drawer.closeDrawer(GravityCompat.START);
                startActivityHelpDesk();
                return true;
            case R.id.nav_exit:
                drawer.closeDrawer(GravityCompat.START);
                exitApp();
                return true;
            default:
                return false;
        }
    }

    public void exitApp() {
        final AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Salir");
        builder.setMessage("¿Desea salir de la aplicación?");
        builder.setPositiveButton("Si", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                Intent intent = new Intent(Intent.ACTION_MAIN);
                intent.addCategory(Intent.CATEGORY_HOME);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            }
        });

        builder.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
            }
        });

        AlertDialog dialog = builder.create();
        dialog.show();


    }

    public void startActivityHelpDesk(){
        Intent intent = new Intent(getBaseContext(), MesaAyudaActivity.class);
        startActivity(intent);
    }
    public void startActivityDashboard(){
        Intent intent = new Intent(getBaseContext(), DashboardActivity.class);
        startActivity(intent);
    }
    public void startActivityNews(){
        Intent intent = new Intent(getBaseContext(), NewsActivity.class);
        startActivity(intent);
    }

    public void startActivityEvents(){
        Intent intent = new Intent(getBaseContext(), EventsActivity.class);
        startActivity(intent);
    }

    public void startActivityBiblio(){
        Intent intent = new Intent(getBaseContext(), BiblioActivity.class);
        startActivity(intent);
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = findViewById(R.id.drawer_layout);
        if (drawer != null) {
            if (drawer.isDrawerOpen(GravityCompat.START)) {
                drawer.closeDrawer(GravityCompat.START);
            } else {
                super.onBackPressed();
            }
        }
    }

    //Check for components
    public boolean checkForBiblioteca(String path) {
        String[] list;
        try {
            list = getAssets().list(path);

            if (list.length > 0) {
                // This is a folder
                for (String file : list) {
                    if (!checkForBiblioteca(path + "/" + file))
                        return false;
                    else if(file.endsWith(".pdf")){
                        return false;
                    }
                }
            }
        } catch (IOException e) {
            return false;
        }
        return true;
    }

    public boolean checkNews() {
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
