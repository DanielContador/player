package cl.dl_distancia_a481.player_tablet.activities;
/**
 * Created by fcollado on 01-31-20.
 */


import androidx.annotation.RequiresApi;
import androidx.annotation.RequiresPermission;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.button.MaterialButton;


import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.utils.CheckInternetConnection;
import cl.dl_distancia_a481.player_tablet.utils.ConnectionChangeListener;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;
import cl.dl_distancia_a481.player_tablet.utils.Licence;



public class LoginActivity extends AppCompatActivity {


    Date currentDate = Calendar.getInstance().getTime();
    private static String uniqueID = null;
    private static final DateFormat dateFormat = new SimpleDateFormat("MM-dd-yyyy hh:mm:ss");
    EditText pass;
    MaterialButton enter_bton;
    TextView info;
    ArrayList<Dummy> dummys;
    CheckInternetConnection connectionChecker = new CheckInternetConnection();
    private boolean connectionAvailable = true;
    Context context;
    private DbHelper dbHelper;
    int version = Build.VERSION.SDK_INT;

    private static final String TAG = "CLIENTES";
    boolean active = false;
    private Licence licence;

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        context = this;

        //Init BD Object
        dbHelper = DbHelper.getHelper(this);
        licence = new Licence();
        //Block app if the end date its obsolete and the SN its not the same
        blockApp();

        //check for licenced app and end date

        info = findViewById(R.id.connectionInfo);
        pass = findViewById(R.id.pass_input);
        enter_bton = findViewById(R.id.enter_button);
        dummys = getTestingList();

        /*OkHttpClient.Builder httpClient = new OkHttpClient.Builder()
                .callTimeout(2, TimeUnit.MINUTES)
                .connectTimeout(1, TimeUnit.MINUTES)
                .readTimeout(1, TimeUnit.MINUTES)
                .writeTimeout(1, TimeUnit.MINUTES);*/



        enter_bton.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.P)
            @Override
            public void onClick(View v) {
                getSN();
            }
        });
    }






    @RequiresApi(api = Build.VERSION_CODES.O)
    @RequiresPermission(value = "android.permission.READ_PHONE_STATE")
    public void blockApp() {
        if (connectionAvailable) {
            //Chekear por validacion online

        }
        else{
            //Chekear por validacion offline
            int status;
            int dateChecker;
            String dateInString;
            Date endDate = new Date();
            Cursor cursor = dbHelper.GetLicence();
            if (cursor.getCount() > 0) {
                if (cursor.moveToFirst()) {
                    do {
                        status = cursor.getInt(3);
                        dateInString = cursor.getString(2);
                        try {
                            endDate = dateFormat.parse(dateInString);
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                        dateChecker = endDate.compareTo(currentDate);
                        if (checkSelfPermission(Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                            // TODO: Consider calling
                            //    Activity#requestPermissions
                            // here to request the missing permissions, and then overriding
                            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
                            //                                          int[] grantResults)
                            // to handle the case where the user grants the permission. See the documentation
                            // for Activity#requestPermissions for more details.
                            return;
                        }
                        if (version > 25)
                            uniqueID = Build.getSerial();
                        else
                            uniqueID = Build.SERIAL;
                        if (dateChecker < 0) {//si es mayor la fecha actual que la termino
                            dbHelper.SetLicence(cursor.getInt(0), 0);
                        }
                        if (status == 1 && dateChecker > 0 && cursor.getString(4).equals(uniqueID)) {//si es mayor la fecha termino que la actual
                            Intent intent = new Intent(getBaseContext(), SplashScreen.class);
                            startActivity(intent);
                        }

                    } while (cursor.moveToNext());
                }
            }
        }
    }


    @RequiresApi(api = Build.VERSION_CODES.P)
    public void getSN() {
        if (ContextCompat.checkSelfPermission(LoginActivity.this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(LoginActivity.this, Manifest.permission.READ_PHONE_STATE)) {
                ActivityCompat.requestPermissions(LoginActivity.this, new String[]{Manifest.permission.READ_PHONE_STATE}, 101);

            } else {
                ActivityCompat.requestPermissions(LoginActivity.this, new String[]{Manifest.permission.READ_PHONE_STATE}, 101);

            }
        } else {
            if (version > 25)
                uniqueID = Build.getSerial();
            else
                uniqueID = Build.SERIAL;

        }
        /*if (ActivityCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(LoginActivity.this, new String[]{Manifest.permission.READ_PHONE_STATE}, 101);
        }*/
    }

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case 101:
                if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    if (ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                        return;
                    }
                    if (version > 25)
                        uniqueID = Build.getSerial();
                    else
                        uniqueID = Build.SERIAL;

                } else {
                    //not granted
                    pass.getText().clear();
                }
                break;
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }


    //Check for internet connection on start
    @Override
    protected void onStart() {
        super.onStart();

        connectionChecker.addConnectionChangeListener(new ConnectionChangeListener() {
            @Override
            public void onConnectionChanged(boolean isConnectionAvailable) {

                if (connectionAvailable && !isConnectionAvailable) {
                    Toast.makeText(LoginActivity.this, "Sin conexión al servidor", Toast.LENGTH_SHORT).show();
                    connectionAvailable = false;
                } else if (!connectionAvailable && isConnectionAvailable && active) {
                    Toast.makeText(LoginActivity.this, "Conexión con el servidor restablecida", Toast.LENGTH_SHORT).show();
                    connectionAvailable = true;
                }
            }
        });
    }

    @Override
    protected void onStop() {
        super.onStop();
        connectionChecker.removeConnectionChangeListener();
    }


    //TESTING DATA
    public ArrayList<Dummy> getTestingList() {
        ArrayList<Dummy> codeList = new ArrayList<>();
        codeList.add(new Dummy("111222", "", false, currentDate, currentDate));
        codeList.add(new Dummy("12345", "", false, currentDate, currentDate));
        codeList.add(new Dummy("222345", "", false, currentDate, currentDate));
        codeList.add(new Dummy("998842", "", false, currentDate, currentDate));
        codeList.add(new Dummy("123456", "", false, currentDate, currentDate));
        return codeList;
    }
    //TESTING CLASS

    class Dummy {

        private String code;
        private String phoneCode;
        private boolean active;
        private Date startDate;
        private Date finishDate;

        public Dummy(String code, String phoneCode, boolean active, Date startDate, Date finishDate) {
            this.code = code;
            this.phoneCode = phoneCode;
            this.active = active;
            this.startDate = startDate;
            this.finishDate = finishDate;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getPhoneCode() {
            return phoneCode;
        }

        public void setPhoneCode(String phoneCode) {
            this.phoneCode = phoneCode;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }

        public Date getStartDate() {
            return startDate;
        }

        public void setStartDate(Date startDate) {
            this.startDate = startDate;
        }

        public Date getFinishDate() {
            return finishDate;
        }

        public void setFinishDate(Date finishDate) {
            this.finishDate = finishDate;
        }
    }

    class listDummy {

        private ArrayList<Dummy> dummyList;

        public listDummy(ArrayList<Dummy> dummyList) {
            this.dummyList = dummyList;
        }

        public ArrayList<Dummy> getDummyList() {
            return dummyList;
        }

        public void setDummyList(ArrayList<Dummy> dummyList) {
            this.dummyList = dummyList;
        }
    }


}
