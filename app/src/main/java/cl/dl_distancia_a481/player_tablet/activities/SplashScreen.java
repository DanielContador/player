package cl.dl_distancia_a481.player_tablet.activities;
/**
 * Created by fcollado on 01-10-20.
 */

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.os.AsyncTask;
import android.os.Bundle;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import android.view.View;
import android.widget.ProgressBar;import android.widget.TextView;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;
import cl.dl_distancia_a481.player_tablet.utils.ExcelLib;

public class SplashScreen extends AppCompatActivity {

    private ProgressBar progressBar;
    private TextView percentageInfo;
    Context context;
    private DbHelper dbHelper;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splashscreen);
        progressBar = findViewById(R.id.determinateBar);
        progressBar.setScaleY(3f);
        percentageInfo = findViewById(R.id.progress_text);
        context = this;
        dbHelper = DbHelper.getHelper(this);
        percentageInfo.setText("Cargando 0%");
        setVersion();
        new LoadViewTask().execute();
    }

    private class LoadViewTask extends AsyncTask<ExcelLib, Integer,Void>{
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            progressBar.setMax(100);
            progressBar.setProgress(0);
            progressBar.setVisibility(View.VISIBLE);
        }

        @Override
        protected Void doInBackground(ExcelLib... excelLibs) {
            ExcelLib excel = new ExcelLib(context);
            try
            {
                //Get the current thread's token
                synchronized (this)
                {
                    //Initialize an integer (that will act as a counter) to zero
                    int counter = 0;
                    boolean flag = false;
                    //While the counter is smaller than four
                    while(counter <= 100)
                    {


                        //Wait 900 milliseconds
                        this.wait(120);
                        if(!flag && counter == 20){
                            excel.ReadExcel();
                            flag = true;
                            counter = 50;
                        }
                        //Increment the counter
                        counter++;
                        //Set the current progress.
                        //This value is going to be passed to the onProgressUpdate() method.
                        publishProgress(counter);
                    }
                }
            }
            catch (InterruptedException e)
            {
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onProgressUpdate(Integer... values) {
            super.onProgressUpdate(values);
            progressBar.setProgress(values[0]);
            percentageInfo.setText("Cargando " + (values[0]- 1) + "%");
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            super.onPostExecute(aVoid);
            //progressBar.setVisibility(View.INVISIBLE);
            Intent mainIntent = new Intent(SplashScreen.this, DashboardActivity.class);
            SplashScreen.this.startActivity(mainIntent);
            SplashScreen.this.finish();
        }
    }

    public void setVersion() {
        TextView version = findViewById(R.id.version_text);
        try {
            PackageInfo pInfo = getPackageManager().getPackageInfo(getPackageName(), 0);
            String ver = pInfo.versionName;
            version.setText("ver " + ver);
        } catch (Exception e) {
            version.setVisibility(View.INVISIBLE);
        }
    }


}