package cl.dl_distancia_a481.player_tablet.recycler.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.classes.Event;

public class ListCursesAdapter extends RecyclerView.Adapter<ListCursesAdapter.ViewHolder> {

    private final ArrayList<Event> events;
    private final Context context;
    private final boolean vertical; // flag para elegir orientación

    // Constructor por defecto: orientación grid (3 columnas)
    public ListCursesAdapter(Context ctx, ArrayList<Event> events) {
        this(ctx, events, false);
    }

    // Constructor que permite definir la orientación
    public ListCursesAdapter(Context ctx, ArrayList<Event> events, boolean vertical) {
        this.context  = ctx;
        this.events   = events;
        this.vertical = vertical;
    }

    /*────────── ViewHolder ─────────*/
    static class ViewHolder extends RecyclerView.ViewHolder {
        ViewHolder(@NonNull View itemView) { super(itemView); }
    }

    /*────────── Crear vista ─────────*/
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent,
                                         int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                               .inflate(R.layout.item_event, parent, false);
        return new ViewHolder(v);
    }

    /*────────── Poner datos ─────────*/
    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int pos) {

        View  item = holder.itemView;
        Event ev   = events.get(pos);

        RecyclerView rv = item.findViewById(R.id.recyclerCont);

        // Configurar LayoutManager según el flag
        if (vertical) {
            rv.setLayoutManager(new LinearLayoutManager(context, LinearLayoutManager.VERTICAL, false));
        } else {
            rv.setLayoutManager(new GridLayoutManager(context, 3));
        }

        rv.setHasFixedSize(true);
        rv.setItemAnimator(new DefaultItemAnimator());
        rv.setAdapter(new ListContentsAdapter(context, ev.getContents()));
    }

    @Override public int getItemCount() { return events.size(); }
}
