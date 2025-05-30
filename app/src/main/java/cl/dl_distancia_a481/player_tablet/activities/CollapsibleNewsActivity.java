package cl.dl_distancia_a481.player_tablet.activities;
/**
 * Created by fcollado on 12-20-19.
 */
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;


import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import cl.dl_distancia_a481.player_tablet.R;

public class CollapsibleNewsActivity extends AppCompatActivity {
    Bundle bundle;
    String name, imageName, contentText;
    TextView newsName, newsContent;
    ImageView newsImage;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_news);
        Toolbar toolbar = findViewById(R.id.event_toolbar);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowHomeEnabled(true);
        //Get Data Received from NewsActivity
        GetReceiveData();
        //Set data in layout
        SetLayout();

        findViewById(R.id.relative1).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(CollapsibleNewsActivity.this, NewsActivity.class);
                startActivity(intent);
            }
        });


    }

    public void GetReceiveData() {
        bundle = this.getIntent().getExtras();
        name = bundle.getString("name");
        imageName = bundle.getString("imageName");
        contentText = bundle.getString("contentText");
    }

    public void SetLayout()  {
        newsName = findViewById(R.id.newsName);
        newsContent = findViewById(R.id.newsContent);
        newsImage = findViewById(R.id.newsImage);

        newsName.setText(name);
        newsContent.setText(contentText);
        try {
            // get input stream
            InputStream ims = this.getResources().getAssets().open("config" + File.separator + imageName);
            // load image as Drawable
            Drawable d = Drawable.createFromStream(ims, null);
            // set image to ImageView
            newsImage.setImageDrawable(d);
        } catch (IOException ex) {
            return;
        }

    }
}
