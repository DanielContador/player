package cl.dl_distancia_a481.player_tablet.recycler.adapters;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.activities.CollapsibleNewsActivity;
import cl.dl_distancia_a481.player_tablet.recycler.classes.News;

public class ListNewsAdapter extends RecyclerView.Adapter<ListNewsAdapter.ViewHolder> {

    private List<News> dataModelList;
    private Context mContext;



    public static class ViewHolder extends RecyclerView.ViewHolder {
        // each data item is just a string in this case
        public View view;

        public ViewHolder(View v) {
            super(v);
            view = v;
        }
    }

    // Adapter's Constructor
    public ListNewsAdapter(Context context, ArrayList<News> list) {
        this.dataModelList = list;
        this.mContext = context;
    }

    @Override
    public ListNewsAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // Create a new view by inflating the row item xml.
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.list_news_item, parent, false);
        //v.setOnClickListener(onClickList);


        return new ListNewsAdapter.ViewHolder(v);
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {

        TextView textViewTitle = holder.view.findViewById(R.id.card_title);
        TextView textViewSubTitle = holder.view.findViewById(R.id.card_subtitle);
        ImageView imageViewImage = holder.view.findViewById(R.id.imageListView);
        try {
            // get input stream
            InputStream ims = mContext.getResources().getAssets().open("config" + File.separator + dataModelList.get(position).getImageName());
            // load image as Drawable
            Drawable d = Drawable.createFromStream(ims, null);
            // set image to ImageView
            imageViewImage.setImageDrawable(d);
        } catch (IOException ex) {
            return;
        }
        textViewTitle.setText(dataModelList.get(position).getName());
        String sub = dataModelList.get(position).getText();
        textViewSubTitle.setText(sub.subSequence(0,200) + "...");

        Button item = holder.view.findViewById(R.id.action_button);
            item.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Bundle bundle = new Bundle();
                    Intent i = new Intent(mContext ,CollapsibleNewsActivity.class);
                    bundle.putString("name", dataModelList.get(position).getName());
                    bundle.putString("imageName", dataModelList.get(position).getImageName());
                    bundle.putString("contentText", dataModelList.get(position).getText());
                    i.putExtras(bundle);
                    mContext.startActivity(i);
                }
            });

    }

    @Override
    public int getItemCount() {
        // Return the total number of items
        return dataModelList.size();
    }


}
