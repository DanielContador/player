package cl.dl_distancia_a481.player_tablet.utils;

import android.app.Dialog;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Button;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.activities.CursoActivity;

/**
 * Created by Developer Android on 26-09-2016.
 */
public class PopupExit extends Dialog implements
        android.view.View.OnClickListener {

    public CursoActivity c;
    public Dialog d;
    public Button btn_no, btn_si;

    public PopupExit(CursoActivity a) {
        super(a);
        // TODO Auto-generated constructor stub
        this.c = a;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.popupexit);
        btn_no = (Button) findViewById(R.id.btn_no);

        btn_si = (Button) findViewById(R.id.btn_si);

        btn_no.setOnClickListener(this);
        btn_si.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_no:
                dismiss();
                break;
            case R.id.btn_si:
                c.Finish_Course();
                break;
            default:
                break;
        }
        dismiss();
    }
}
