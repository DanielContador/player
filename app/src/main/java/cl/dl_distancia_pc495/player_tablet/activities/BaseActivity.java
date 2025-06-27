package cl.dl_distancia_a481.player_tablet.activities;

import android.widget.Button;
import android.widget.Toast;
import android.widget.ImageButton;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.content.res.Configuration;
import android.graphics.PorterDuff;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.ConstraintSet;
import androidx.transition.ChangeBounds;
import androidx.transition.TransitionManager;
import androidx.interpolator.view.animation.FastOutSlowInInterpolator;

import androidx.core.content.ContextCompat;
import cl.dl_distancia_a481.player_tablet.AppState;
import android.widget.ProgressBar;
import android.net.Uri;
import java.util.List;
import java.util.ArrayList;
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
    private List<ImageButton> orderedButtons = new ArrayList<>();

    private ImageButton btnHome;
    private ImageButton selectedButton = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        dbHelper = DbHelper.getHelper(this);
        setContentView(R.layout.activity_base);
        TextView titlePrefix = findViewById(R.id.textViewItemTitlePrefix);
        TextView titleSuffix = findViewById(R.id.textViewItemTitleSuffix);

        // Calcula los valores
        int total = 0, cant = 0;
        Cursor cur = dbHelper.GetEvents("0");
        if (cur != null && cur.moveToFirst()) {
            do {
                Cursor c2 = dbHelper.GetContents(cur.getInt(0), "0");
                if (c2 != null && c2.moveToFirst()) {
                    do {
                        total += dbHelper.GetTotalPorcent(c2.getString(0));
                    } while (c2.moveToNext());
                    cant += c2.getCount();
                    c2.close();
                }
            } while (cur.moveToNext());
            cur.close();
        }

        // Mostrar conteo
        // 3) Construye el texto dinámico y sepáralo en los dos TextViews:
        int completedCount = (cant == 0 ? 0 : total / 100);
        String prefixText = completedCount + "/" + cant + " contenidos ";
        titlePrefix.setText(prefixText);
        // la palabra “completados” siempre va en el TextView de color verde
        titleSuffix.setText("completados");
        // ImageButton selected = findViewById(AppState.selectedButtonId);
        // if (selected != null) {
        // selected.post(() -> selectButton(selected));
        // }

        btnHome = findViewById(R.id.btnHome);
        if (btnHome != null) {
            btnHome.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    selectButton(btnHome);
                    Intent intent = new Intent(getBaseContext(), DashboardActivity.class);
                    startActivity(intent);
                }
            });

            // // Selección inicial (ejecutado después de layout)
            // btnHome.post(new Runnable() {
            // @Override
            // public void run() {
            // selectButton(btnHome);
            // }
            // });
            // }

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
                    // public void onClick(View v) {
                    // selectButton(btnMenu);
                    // drawerLayout.openDrawer(GravityCompat.START);
                    // }

                    public void onClick(View v) {
                        selectButton(btnMenu);
                        if (AppState.goToCombinedCourses) {
                            Intent intent = new Intent(getBaseContext(), CombinedCoursesActivity.class);
                            startActivity(intent);
                        } else {
                            Intent intent = new Intent(getBaseContext(), EventsActivity.class);
                            startActivity(intent);
                        }
                    }
                });
            }

            ImageView btnLogo = findViewById(R.id.logoPensamiento);
            if (btnLogo != null && drawerLayout != null) {
                btnLogo.setOnClickListener(new View.OnClickListener() {
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
                        selectButton(btnHome);
                        // selectButton(btnHome);
                        Intent intent = new Intent(getBaseContext(), DashboardActivity.class);
                        startActivity(intent);
                    }
                });
            }
            // Deshabilita el gesto de abrir el drawer desde el borde
            if (drawerLayout != null) {
                drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
            }

            actionBarDrawerToggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar,
                    R.string.navigation_drawer_open,
                    R.string.navigation_drawer_close);
            if (drawerLayout != null) {
                drawerLayout.addDrawerListener(actionBarDrawerToggle);
            }
            actionBarDrawerToggle.syncState();

            if (navigationView != null) {
                navigationView.setNavigationItemSelectedListener(this);
            }

            // check for conditions to turn off and on the buttons
            boolean checkBiblio = checkForBiblioteca("config");
            if (checkBiblio) {
                Menu nav_Menu = navigationView.getMenu();
                nav_Menu.findItem(R.id.nav_biblio).setVisible(false);
            }
            boolean checkNews = checkNews();
            if (checkNews) {
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
                        selectButton(btnMenuInfo);
                        Intent intent = new Intent(getBaseContext(), MesaAyudaActivity.class);
                        startActivity(intent);
                    }
                });
            }

            orderedButtons.add(btnHome);
            orderedButtons.add(btnMenu);
            orderedButtons.add(btnMenuInfo);

            int num = calculatePercentBase();
            ProgressBar gauge = findViewById(R.id.totalProgressBar);
            TextView percent = findViewById(R.id.totalProgress);
            gauge.setProgress(num);
            percent.setText(num + "%");
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus && selectedButton == null) { // primera vez
            selectButton(btnHome); // centra sobre Home
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        ImageButton toSelect = null;
        Class<?> me = getClass(); // actividad visible

        if (me == DashboardActivity.class)
            toSelect = btnHome;
        else if (me == EventsActivity.class
                || me == CombinedCoursesActivity.class) // <-- añadido
            toSelect = orderedButtons.size() > 1 ? orderedButtons.get(1) : null;
        else if (me == MesaAyudaActivity.class)
            toSelect = orderedButtons.size() > 2 ? orderedButtons.get(2) : null;

        /* Fallback si nada calza */
        if (toSelect == null && AppState.selectedButtonId != 0) {
            toSelect = findViewById(AppState.selectedButtonId);
        }
        if (toSelect != null) {
            final ImageButton finalBtn = toSelect;
            toSelect.post(() -> selectButton(finalBtn));
        }
    }

    /** Mueve el grupo central detrás del botón pulsado */
    /** Mueve el grupo, pinta el icono en blanco y lo “levanta” */
    private void selectButton(ImageButton button) {

        if (selectedButton == button)
            return;

        /* ─── 1. Devuelve el anterior a su estado normal ─── */
        if (selectedButton != null) {
            selectedButton.animate()
                    .translationY(0) // nivelarlo
                    .setDuration(150)
                    .start();
            selectedButton.setColorFilter(
                    ContextCompat.getColor(this, R.color.bottom_icon_normal),
                    PorterDuff.Mode.SRC_IN);
        }

        /* ─── 2. Nuevo icono: pintado y levantado ─── */
        float lift = getResources().getDimension(R.dimen.bottom_icon_raise);
        button.animate()
                .translationY(-lift) // se sube
                .setDuration(150)
                .start();
        button.setColorFilter(
                ContextCompat.getColor(this, R.color.bottom_icon_selected),
                PorterDuff.Mode.SRC_IN);

        /* ─── 3. Guarda estado y centra el grupo flotante ─── */
        selectedButton = button;
        AppState.selectedButtonId = button.getId();

        // Reemplaza la lógica de translationX por bias con ChangeBounds
        moveFloatingGroup(button); // ← esta llamada usa ConstraintSet + TransitionManager
    }

    private void moveFloatingGroup(ImageButton button) {

        ConstraintLayout parent = findViewById(R.id.bottomBarContainer);
        View floatingGrp = findViewById(R.id.floatingGroup);
        View circulo = findViewById(R.id.circuloContainer); // círculo centrado

        /*
         * 1. Coordenadas absolutas ----------------------------------------------------
         */
        int[] parentPos = new int[2];
        int[] btnPos = new int[2];
        parent.getLocationOnScreen(parentPos);
        button.getLocationOnScreen(btnPos);

        float buttonCenterPx = (btnPos[0] - parentPos[0]) + button.getWidth() / 2f;

        /*
         * 2. Centro visual del círculo dentro de floatingGrp --------------------------
         */
        float circleCenterInsideGrp = circulo.getLeft() + circulo.getWidth() / 2f;

        /*
         * 3. Izquierda deseada del grupo para que ambos centros coincidan -------------
         */
        float desiredLeftPx = buttonCenterPx - circleCenterInsideGrp;

        /*
         * 4. Bias = fracción del espacio libre (W-w) que queda a la izquierda ---------
         */
        float freeSpacePx = parent.getWidth() - floatingGrp.getWidth();
        float bias = freeSpacePx == 0 ? 0f : desiredLeftPx / freeSpacePx;
        bias = Math.max(0f, Math.min(1f, bias)); // clamp 0-1 por seguridad

        /*
         * 5. Animamos el cambio
         * --------------------------------------------------------
         */
        ConstraintSet set = new ConstraintSet();
        set.clone(parent);
        set.setHorizontalBias(R.id.floatingGroup, bias);

        ChangeBounds cb = new ChangeBounds();
        cb.setDuration(300);
        cb.setInterpolator(new FastOutSlowInInterpolator());

        TransitionManager.beginDelayedTransition(parent, cb);
        set.applyTo(parent);
    }

    private void showHelpTopDialog() {
        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_helptop);
        Window window = dialog.getWindow();
        if (window != null) {
            window.setBackgroundDrawable(
                    new ColorDrawable(android.graphics.Color.TRANSPARENT));
        }

        ImageView closeBtn = dialog.findViewById(R.id.dialog_close);
        closeBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dialog.dismiss();
            }
        });

        ImageButton soporteBtn = dialog.findViewById(R.id.soporte_btn);
        soporteBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("message/rfc822");
                intent.putExtra(Intent.EXTRA_EMAIL, new String[] { "soporte@dl.cl" });
                intent.putExtra(Intent.EXTRA_SUBJECT, "Consulta de Soporte");

                try {
                    startActivity(Intent.createChooser(intent, "Enviar correo..."));
                } catch (android.content.ActivityNotFoundException ex) {
                    Toast.makeText(v.getContext(), "No se encontró una aplicación de correo.", Toast.LENGTH_SHORT)
                            .show();
                }
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
                if (AppState.goToCombinedCourses) {
                    Intent intent = new Intent(getBaseContext(), CombinedCoursesActivity.class);
                    startActivity(intent);
                } else {
                    startActivityEvents();
                }
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

    public void startActivityHelpDesk() {
        Intent intent = new Intent(getBaseContext(), MesaAyudaActivity.class);
        startActivity(intent);
    }

    public void startActivityDashboard() {
        Intent intent = new Intent(getBaseContext(), DashboardActivity.class);
        startActivity(intent);
    }

    public void startActivityNews() {
        Intent intent = new Intent(getBaseContext(), NewsActivity.class);
        startActivity(intent);
    }

    public void startActivityEvents() {
        Intent intent = new Intent(getBaseContext(), EventsActivity.class);
        startActivity(intent);
    }

    public void startActivityBiblio() {
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

    // Check for components
    public boolean checkForBiblioteca(String path) {
        String[] list;
        try {
            list = getAssets().list(path);

            if (list.length > 0) {
                // This is a folder
                for (String file : list) {
                    if (!checkForBiblioteca(path + "/" + file))
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

    /** Lógica original, pero privada para que nadie la sobreescriba */
    private int calculatePercentBase() {
        int total = 0, cant = 0;
        Cursor cur = dbHelper.GetEvents("0");
        if (cur != null && cur.moveToFirst()) {
            do {
                Cursor c2 = dbHelper.GetContents(cur.getInt(0), "0");
                if (c2 != null && c2.moveToFirst()) {
                    do {
                        total += dbHelper.GetTotalPorcent(c2.getString(0));
                    } while (c2.moveToNext());
                    cant += c2.getCount();
                    c2.close();
                }
            } while (cur.moveToNext());
            cur.close();
        }
        return cant == 0 ? 0 : total / cant;
    }

    // private void selectButton(ImageButton button) {
    // // Restaurar estado anterior
    // if (selectedButton != null) {
    // selectedButton.setBackgroundResource(R.drawable.circle_shape); // Fondo
    // normal
    // selectedButton.setColorFilter(getResources().getColor(R.color.icon_normal));
    // // Tint normal
    // }

    // // Aplicar estado seleccionado
    // button.setBackgroundResource(R.drawable.circle_shape_selected); // Fondo
    // "activo"
    // button.setColorFilter(getResources().getColor(R.color.icon_selected)); //
    // Tint blanco

    // selectedButton = button;
    // }

}