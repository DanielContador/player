package cl.dl_distancia_a481.player_tablet.activities;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.TextView;

import com.mohammedalaa.gifloading.LoadingView;


import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.utils.PopupExit;
import cl.dl_distancia_a481.player_tablet.utils.Scorm;

import static xdroid.toaster.Toaster.toast;


public class CursoActivity extends Activity {

    private WebView mWebView;
    private TextView txt;
    private LoadingView loadingView;
    private int Id_event, Id_content;
    private String Path;
    private Bundle state;
    public static final String EXTRA_MESSAGE = "cl.dl_distancia_a481.player_tablet.extra.MESSAGE";
    int version = Build.VERSION.SDK_INT;
    Context context;
    String identifier, identifierref;
    Bundle bundle;
    boolean close = false;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
        setContentView(R.layout.activity_curso);


       //Get Data Received from ContentsActivity
        GetReceiveData();


        //Setting UI components
        SetUI();


    }
    //comentar las fuciones onStop y onResume en caso de que la apk contenga pdf
    /*@Override
    protected void onStop() {
        //toast("ON STOP");
        if(!close){//if close app or remove focus call finish
            close = true;
            Finish_Course();
        }
        super.onStop();
    }

    @Override
    protected void onResume()
    {
        if (close = true)
        {
            close = false;
        }
        super.onResume();
    }*/

    //Setting UI components
    public void SetUI() {

        Button btn_cerrar = findViewById(R.id.btn_cerrar);
        btn_cerrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Finish_Course();
            }
        });

        //force to keep active, is needed because audio mp3 stopped
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        mWebView = findViewById(R.id.activity_main_webview);
        txt = findViewById(R.id.TextNotContent);


        // Force links and redirects to open in the WebView instead of in a browser
        mWebView.setWebChromeClient(new WebChromeClient());
        mWebView.setWebViewClient(new WebViewClient());
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        //webSettings.setOffscreenPreRaster(true);
        loadingView = findViewById(R.id.loading_view);
        //mProgressView = findViewById(R.id.back_progress);

        //SET WebView COMPONENT

        try {

            //Set JavaScript INTERFACE for WebView between Player and Android Code
            Scorm jsScorm = new Scorm(context);

            jsScorm.setRegistroId(Id_content); //5890
            jsScorm.setCourseId(1);
            jsScorm.setStudentId(1);
            jsScorm.setSCO(Path); //07072016220716
            jsScorm.setIdEvento(Integer.toString(Id_event));

            mWebView.addJavascriptInterface(jsScorm, "JSInterface");
            mWebView.getSettings().setMediaPlaybackRequiresUserGesture(false);
            mWebView.getSettings().setAllowFileAccess(true);
            mWebView.getSettings().setAllowContentAccess(true);
            mWebView.getSettings().setAllowFileAccessFromFileURLs(true);
            mWebView.getSettings().setAllowUniversalAccessFromFileURLs(true);
            mWebView.getSettings().setPluginState(WebSettings.PluginState.ON);
            mWebView.getSettings().setLoadWithOverviewMode(true);

            Log.i("WebView version", mWebView.getSettings().getUserAgentString());

            mWebView.loadUrl("file:///android_asset/www/player/player.htm");

            mWebView.setWebViewClient(new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                    if (request.getUrl().toString().endsWith(".pdf")){
                        String[] parts = request.getUrl().toString().split("file:///android_asset/");
                        String path = parts[1];
                        Intent intent = new Intent(context, PDFActivity.class);
                        intent.putExtra(EXTRA_MESSAGE, path);
                        startActivity(intent);
                    }
                    return false;
                }
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {// Problemas con PDF en Pixi4
                    if(version < 24 && url.endsWith(".pdf")){
                        String[] parts = url.split("file:///android_asset/");
                        String path = parts[1];
                        Intent intent = new Intent(context, PDFActivity.class);
                        intent.putExtra(EXTRA_MESSAGE, path);
                        startActivity(intent);
                    }
                    return false;
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    try {
                        /*if(version < 24 && url.endsWith(".pdf")){ // Problemas con PDF en Pixi4
                            String[] parts = url.split("file:///android_asset/");
                            String path = parts[1];
                            Intent intent = new Intent(context, PDFActivity.class);
                            intent.putExtra(EXTRA_MESSAGE, path);
                            startActivity(intent);
                        }*/
                        loadingView.showLoading();
                        final Handler handler = new Handler();
                        handler.postDelayed(new Runnable() {
                            @Override
                            public void run() {
                                //Do something after 4000ms
                                mWebView.loadUrl("javascript:gotoSco(\"" + identifierref + "\",\"" + identifier + "\")");
                                loadingView.hideLoading();
                            }
                        }, 4000);

                    } catch (Exception e) {
                        Log.e("tag", e.getMessage());
                        toast("No se pudo");
                        return;
                    }
                    //}


                }
            });

        } catch (Exception e) {
            txt.setText(R.string.error_cargando);
            txt.setVisibility(View.VISIBLE);
        }

    }

    //Get Data Received from ContentsActivity
    public void GetReceiveData() {
        bundle = this.getIntent().getExtras();

        Id_event = bundle.getInt("IdEvent");
        Path = bundle.getString("Path");
        Id_content = bundle.getInt("IdContent");

        identifier = bundle.getString("identifier");
        identifierref = bundle.getString("identifierref");
    }

    // Finish_Course
    @Override
    public void onBackPressed() {
        //Show Exit popup
        PopupExit cdd = new PopupExit(CursoActivity.this);
        cdd.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        cdd.show();
    }

    //When finish a content and press back
    public void Finish_Course() {
        //toast("FINISH");

        //Set flag using for OnStop
        close = true; //no call finish when finish CursoActivity

        Log.d(">>>", "Finish_Course");

        //loadingView.showLoading();

        //To close AUDIO
        //mWebView.onPause();
        mWebView.loadUrl("about:blank");

        //Set Scorm Finish
        mWebView.loadUrl("javascript:navigate('exit')");

        final Intent intent = new Intent(CursoActivity.this, TocActivity.class);
        intent.putExtras(bundle);

        //Go back to content activity when pass 1 sec
        //Wait for player finish and DB actualized
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                //Do something after 1000ms
                startActivity(intent);
                //loadingView.hideLoading();
            }
        }, 1000);
    }

    @Override
    protected void onSaveInstanceState(Bundle state )
    {
        super.onSaveInstanceState(state);
        mWebView.saveState(state);
    }

    @Override
    protected void onRestoreInstanceState(Bundle state)
    {
        super.onRestoreInstanceState(state);
        mWebView.restoreState(state);
    }
}