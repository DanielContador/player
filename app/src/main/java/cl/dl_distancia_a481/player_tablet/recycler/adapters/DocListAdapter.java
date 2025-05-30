package cl.dl_distancia_a481.player_tablet.recycler.adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.activities.PDFActivity;

public class DocListAdapter extends RecyclerView.Adapter<DocListAdapter.DocViewHolder> {
    private final ArrayList<String> mDocList;
    private final LayoutInflater mInflater;
    Context context;
    public static final String EXTRA_MESSAGE = "cl.dl_distancia_a481.player_tablet.extra.MESSAGE";

    public DocListAdapter(Context context, ArrayList<String> mDocList) {
        mInflater = LayoutInflater.from(context);
        this.mDocList = mDocList;
        this.context = context;
    }

    class DocViewHolder extends RecyclerView.ViewHolder
            implements View.OnClickListener {
        public final TextView wordItemView;
        final DocListAdapter mAdapter;

        /**
         * Creates a new custom view holder to hold the view to display in
         * the RecyclerView.
         *
         * @param itemView The view in which to display the data.
         * @param adapter The adapter that manages the the data and views
         *                for the RecyclerView.
         */
        public DocViewHolder(View itemView, DocListAdapter adapter) {
            super(itemView);
            wordItemView = itemView.findViewById(R.id.pdf);
            this.mAdapter = adapter;
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View view) {
            // Get the position of the item that was clicked.
            int mPosition = getLayoutPosition();
            String element = mDocList.get(mPosition);

            Intent intent = new Intent(context, PDFActivity.class);
            intent.putExtra(EXTRA_MESSAGE, "config" + "/" + element + ".pdf");
            context.startActivity(intent);

            // Notify the adapter, that the data has changed so it can
            // update the RecyclerView to display the data.
            mAdapter.notifyDataSetChanged();
        }
    }



    /**
     * Called when RecyclerView needs a new ViewHolder of the given type to
     * represent an item.
     *
     * This new ViewHolder should be constructed with a new View that can
     * represent the items of the given type. You can either create a new View
     * manually or inflate it from an XML layout file.
     *
     * The new ViewHolder will be used to display items of the adapter using
     * onBindViewHolder(ViewHolder, int, List). Since it will be reused to
     * display different items in the data set, it is a good idea to cache
     * references to sub views of the View to avoid unnecessary findViewById()
     * calls.
     *
     * @param parent   The ViewGroup into which the new View will be added after
     *                 it is bound to an adapter position.
     * @param viewType The view type of the new View. @return A new ViewHolder
     *                 that holds a View of the given view type.
     */
    @Override
    public DocListAdapter.DocViewHolder onCreateViewHolder(ViewGroup parent,
                                                           int viewType) {
        // Inflate an item view.
        View mItemView = mInflater.inflate(
                R.layout.pdf_list_item, parent, false);
        return new DocViewHolder(mItemView, this);
    }

    /**
     * Called by RecyclerView to display the data at the specified position.
     * This method should update the contents of the ViewHolder.itemView to
     * reflect the item at the given position.
     *
     * @param holder   The ViewHolder which should be updated to represent
     *                 the contents of the item at the given position in the
     *                 data set.
     * @param position The position of the item within the adapter's data set.
     */
    @Override
    public void onBindViewHolder(DocListAdapter.DocViewHolder holder,
                                 int position) {
        // Retrieve the data for that position.
        String mCurrent = mDocList.get(position);
        // Add the data to the view holder.
        holder.wordItemView.setText(mCurrent);
    }

    /**
     * Returns the total number of items in the data set held by the adapter.
     *
     * @return The total number of items in this adapter.
     */
    @Override
    public int getItemCount() {
        return mDocList.size();
    }
}
