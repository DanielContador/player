package cl.dl_distancia_a481.player_tablet.activities;

/**
 * Created by fcollado on 01-08-20.
 */
import android.os.Bundle;
import android.widget.FrameLayout;
import com.google.android.material.navigation.NavigationView;
import cl.dl_distancia_a481.player_tablet.AppState;

import cl.dl_distancia_a481.player_tablet.R;

public class MesaAyudaActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        FrameLayout contentFrameLayout = findViewById(R.id.content_frame); // Remember this is the FrameLayout area
                                                                           // within your activity_main.xml
                                                                           // getLayoutInflater().inflate(R.layout.activity_main,
                                                                           // contentFrameLayout);

        getLayoutInflater().inflate(R.layout.activity_mesa_ayuda, contentFrameLayout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.getMenu().getItem(4).setChecked(true);
    }

    @Override
    protected void onResume() {
        AppState.currentActivityClass = MesaAyudaActivity.class;
        super.onResume();
    }

}
