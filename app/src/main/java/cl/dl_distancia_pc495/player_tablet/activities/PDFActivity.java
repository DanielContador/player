package cl.dl_distancia_a481.player_tablet.activities;
/**
 * Created by fcollado on 12-12-19.
 */
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;

import android.view.View;
import android.widget.Toast;


import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.github.barteksc.pdfviewer.PDFView;
import com.github.barteksc.pdfviewer.listener.OnLoadCompleteListener;
import com.github.barteksc.pdfviewer.listener.OnPageChangeListener;
import com.github.barteksc.pdfviewer.listener.OnPageErrorListener;
import com.github.barteksc.pdfviewer.scroll.DefaultScrollHandle;
import com.github.barteksc.pdfviewer.util.FitPolicy;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import cl.dl_distancia_a481.player_tablet.R;

public class PDFActivity extends AppCompatActivity implements OnPageChangeListener, OnLoadCompleteListener,
        OnPageErrorListener {

    Integer pageNumber = 0;
    PDFView pdfView;
    private String url;
    private static final String TAG = PDFActivity.class.getSimpleName();
    private static final int MY_PERMISSION_REQUEST_STORAGE = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pdf);
        Intent intent = getIntent();
        url = intent.getStringExtra(CursoActivity.EXTRA_MESSAGE);
        Toolbar toolbar = findViewById(R.id.pdf_toolbar);
        setSupportActionBar(toolbar);
        //Load pdf file with pluggin
        pdfView = findViewById(R.id.pdfView);
        pdfView.setBackgroundColor(Color.BLACK);
        pdfView.setNestedScrollingEnabled(true);
        pdfView.fromAsset(url)
                .defaultPage(pageNumber)
                .onPageChange(this)
                .enableAnnotationRendering(true)
                .onLoad(this)
                .scrollHandle(new DefaultScrollHandle(this))
                .spacing(10) // in dp
                .onPageError(this)
                .pageFitPolicy(FitPolicy.WIDTH)
                .load();

        findViewById(R.id.action_download).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                permissionTask();
            }
        });

        findViewById(R.id.action_close).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
    }

    public void permissionTask() {
        //give the app permission
        if (ContextCompat.checkSelfPermission(PDFActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(PDFActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE)) {
                ActivityCompat.requestPermissions(PDFActivity.this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, MY_PERMISSION_REQUEST_STORAGE);

            } else {
                ActivityCompat.requestPermissions(PDFActivity.this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, MY_PERMISSION_REQUEST_STORAGE);

            }
        } else {
           copyFileFromAssets(url);
        }

    }

    @Override
    public void loadComplete(int nbPages) {

    }

    @Override
    public void onPageChanged(int page, int pageCount) {

    }

    @Override
    public void onPageError(int page, Throwable t) {
        Log.e(TAG, "Cannot load page " + page);
    }

    private void copyFile(InputStream inputStream, OutputStream outputStream) throws IOException {
        byte[] buffer = new byte[1024];
        int read;
        while ((read = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, read);
        }
    }

    private void copyFileFromAssets(String fileName) {
        String dirPath = Environment.getExternalStorageDirectory().getAbsolutePath() + "/Curso A Distancia";
        File file = new File(dirPath);
        File url = new File(fileName);
        if (!file.exists()) {
            file.mkdirs();
        }

        AssetManager assetManager = getAssets();
        InputStream inputStream = null;
        OutputStream outputStream = null;

        try {
            inputStream = assetManager.open(fileName);
            File outputFile = new File(dirPath, url.getName());
            outputStream = new FileOutputStream(outputFile);
            copyFile(inputStream, outputStream);
            Toast.makeText(this, "Descarga exitosa en: " + outputFile.toString(), Toast.LENGTH_SHORT).show();
        } catch (IOException e) {
            e.printStackTrace();
            Toast.makeText(this, "Error!", Toast.LENGTH_SHORT).show();
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (outputStream != null) {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }


    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            case MY_PERMISSION_REQUEST_STORAGE: {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    if (ContextCompat.checkSelfPermission(PDFActivity.this, Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                        copyFileFromAssets(url);
                    }
                } else {

                }
            }
        }
    }
}
