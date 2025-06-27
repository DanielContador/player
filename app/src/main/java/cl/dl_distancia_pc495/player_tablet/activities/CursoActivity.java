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
import cl.dl_distancia_a481.player_tablet.net.LocalWebServer; // ①  NUEVO
import fi.iki.elonen.NanoHTTPD;                                 // ②  NUEVO
import cl.dl_distancia_a481.player_tablet.AppState;
import cl.dl_distancia_a481.player_tablet.activities.CombinedCoursesActivity;
import cl.dl_distancia_a481.player_tablet.activities.TocActivity;

import static xdroid.toaster.Toaster.toast;

public class CursoActivity extends Activity {

    // ────────────────────────────────────────────────────────────────────────────
    // CAMPOS
    // ────────────────────────────────────────────────────────────────────────────
    private WebView mWebView;
    private TextView txt;
    private LoadingView loadingView;

    private int Id_event, Id_content;
    private String Path;
    private Bundle state;
    public static final String EXTRA_MESSAGE = "cl.dl_distancia_a481.player_tablet.extra.MESSAGE";

    private int version = Build.VERSION.SDK_INT;
    private Context context;

    private String identifier, identifierref;
    private Bundle bundle;
    private boolean close = false;

    // ★ Servidor HTTP local
    private LocalWebServer webServer;
    private int serverPort;

    // ────────────────────────────────────────────────────────────────────────────
    // CICLO DE VIDA
    // ────────────────────────────────────────────────────────────────────────────
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        context = this;
        setContentView(R.layout.activity_curso);

        GetReceiveData();    // Datos que llegan
        startLocalServer();  // ③  Arrancamos el servidor
        SetUI();             // Configuramos la UI y el WebView
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (webServer != null) webServer.stop(); // ④  Paramos el servidor
    }

    // ────────────────────────────────────────────────────────────────────────────
    // SERVIDOR LOCAL
    // ────────────────────────────────────────────────────────────────────────────
    private void startLocalServer() {
        try {
            webServer = new LocalWebServer(getApplicationContext(), 0); // 0 = puerto libre
            webServer.start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
            serverPort = webServer.getListeningPort();
            Log.i("LocalWebServer", "Escuchando en puerto " + serverPort);
        } catch (Exception e) {
            throw new RuntimeException("No se pudo iniciar el servidor local", e);
        }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // UI / WEBVIEW
    // ────────────────────────────────────────────────────────────────────────────
    public void SetUI() {
        Button btn_cerrar = findViewById(R.id.btn_cerrar);
        btn_cerrar.setOnClickListener(v -> Finish_Course());

        // Mantener la pantalla encendida (audio)
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        mWebView   = findViewById(R.id.activity_main_webview);
        txt        = findViewById(R.id.TextNotContent);
        loadingView = findViewById(R.id.loading_view);

        // Configuración básica del WebView
        mWebView.setWebChromeClient(new WebChromeClient());
        mWebView.setWebViewClient(new InternalClient());
        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        // Los siguiente *allowFileAccess* ya no son estrictamente necesarios, pero no molestan
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webSettings.setLoadWithOverviewMode(true);

        // JavaScriptInterface SCORM
        Scorm jsScorm = new Scorm(context);
        jsScorm.setRegistroId(Id_content);
        jsScorm.setCourseId(1);
        jsScorm.setStudentId(1);
        jsScorm.setSCO(Path);
        jsScorm.setIdEvento(Integer.toString(Id_event));
        mWebView.addJavascriptInterface(jsScorm, "JSInterface");

        // URL de inicio ahora vía http://127.0.0.1
        String startUrl = "http://127.0.0.1:" + serverPort + "/player/player.htm";
        Log.i("CursoActivity", "Cargando URL inicial: " + startUrl);
        mWebView.loadUrl(startUrl);
    }

    // ────────────────────────────────────────────────────────────────────────────
    // CLIENTE INTERNO DEL WEBVIEW
    // ────────────────────────────────────────────────────────────────────────────
    private class InternalClient extends WebViewClient {

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            String url = request.getUrl().toString();
            return handleUrl(view, url);
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) { // < API‑24
            return handleUrl(view, url);
        }

        private boolean handleUrl(WebView view, String url) {
            if (url.endsWith(".pdf")) {
                Intent intent = new Intent(context, PDFActivity.class);
                intent.putExtra(EXTRA_MESSAGE, url); // ahora viene con http://127.0.0.1
                startActivity(intent);
                return true; // no cargar en WebView
            }
            return false;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            try {
                loadingView.showLoading();
                new Handler().postDelayed(() -> {
                    mWebView.loadUrl("javascript:gotoSco(\"" + identifierref + "\", \"" + identifier + "\")");
                    loadingView.hideLoading();
                }, 4000);
            } catch (Exception e) {
                Log.e("CursoActivity", "onPageFinished error", e);
                toast("No se pudo");
            }
        }
    }

    // ────────────────────────────────────────────────────────────────────────────
    // DATOS RECIBIDOS
    // ────────────────────────────────────────────────────────────────────────────
    public void GetReceiveData() {
        bundle       = getIntent().getExtras();
        Id_event     = bundle.getInt("IdEvent");
        Path         = bundle.getString("Path");
        Id_content   = bundle.getInt("IdContent");
        identifier   = bundle.getString("identifier");
        identifierref= bundle.getString("identifierref");
    }

    // ────────────────────────────────────────────────────────────────────────────
    // SALIDA Y LIMPIEZA
    // ────────────────────────────────────────────────────────────────────────────
    @Override
    public void onBackPressed() {
        PopupExit cdd = new PopupExit(CursoActivity.this);
        cdd.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        cdd.show();
    }

    public void Finish_Course() {
        close = true;
        Log.d("CursoActivity", "Finish_Course");

        mWebView.loadUrl("about:blank");
        mWebView.loadUrl("javascript:navigate('exit')");

        Intent intent;
        if (AppState.goToCombinedCourses) {
            intent = new Intent(CursoActivity.this, CombinedCoursesActivity.class);
        } else {
            intent = new Intent(CursoActivity.this, TocActivity.class);
            intent.putExtras(bundle);
        }

        new Handler().postDelayed(() -> startActivity(intent), 1000);
    }

    @Override
    protected void onSaveInstanceState(Bundle state) {
        super.onSaveInstanceState(state);
        mWebView.saveState(state);
    }

    @Override
    protected void onRestoreInstanceState(Bundle state) {
        super.onRestoreInstanceState(state);
        mWebView.restoreState(state);
    }
}
