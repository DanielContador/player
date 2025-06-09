package cl.dl_distancia_a481.player_tablet.recycler.adapters;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.ProgressBar;
import com.github.vipulasri.timelineview.TimelineView;

import java.util.ArrayList;

import org.w3c.dom.Text;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.activities.CursoActivity;
import cl.dl_distancia_a481.player_tablet.utils.TocItem;

public class ListItemTocAdapter extends RecyclerView.Adapter<ListItemTocAdapter.ViewHolder> {

    private ArrayList<TocItem> listtocitems;
    private final LayoutInflater mInflater;
    private int progresoCurso = 0;
    private int number=0;
    Context context;
    Bundle bundle;

    class ViewHolder extends RecyclerView.ViewHolder {
        // each data item is just a string in this case
        final ListItemTocAdapter mAdapter;
        public TimelineView mTimelineView;

        public ViewHolder(View itemView, ListItemTocAdapter adapter, int viewType) {
            super(itemView);
            this.mAdapter = adapter;
            mTimelineView = itemView.findViewById(R.id.timeline);
            mTimelineView.initLine(viewType);
        }
    }

    // Adapter's Constructor
    public ListItemTocAdapter(Context context, ArrayList<TocItem> listtocitems, Bundle b) {
        mInflater = LayoutInflater.from(context);
        this.listtocitems = listtocitems;
        this.context = context;
        this.bundle = b;

        this.progresoCurso = b.getInt("Progreso", 0);
        this.number = b.getInt("Number", 0);
    }

    // Create new views. This is invoked by the layout manager.
    @Override
    public ListItemTocAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v;
        // v = mInflater.inflate(R.layout.item_activity, parent, false);
        switch (viewType) {
            case 0:
                v = mInflater.inflate(R.layout.item_activity, parent, false);
                break;
            case 1:
                v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_activitytitle, parent, false);
                break;
            default:
                v = mInflater.inflate(R.layout.item_activitytitle, parent, false);
                break;
        }
        return new ViewHolder(v, this, viewType);
    }

    @Override
    public int getItemCount() {
        return listtocitems.size();
    }

    @Override
    public int getItemViewType(int position) {
        // Just as an example, return 0 or 2 depending on position
        // Note that unlike in ListView adapters, types don't have to be contiguous
        // return TimelineView.getTimeLineViewType(position, getItemCount());
        if (listtocitems.get(position).parent) {
            return 1;
        } else {
            return 0;
        }
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {
        TextView textViewNumber = holder.itemView.findViewById(R.id.number);
        textViewNumber.setText("0"+number);
        TextView progresoText = holder.itemView.findViewById(R.id.itemProgress);
        progresoText.setText(progresoCurso + "%");
        ProgressBar progreso = holder.itemView.findViewById(R.id.itemProgressBar);
        progreso.setProgress(progresoCurso);
        TextView textViewTitle = holder.itemView.findViewById(R.id.item_name);
        textViewTitle.setText(listtocitems.get(position).name);
        RelativeLayout chipEstado = holder.itemView.findViewById(R.id.chip_estado);
        TextView statusText = holder.itemView.findViewById(R.id.statusText);

        // NUEVO: Setear el número de ítem si existe el TextView correspondiente
        TextView itemNumber = holder.itemView.findViewById(R.id.item_number);
        if (itemNumber != null && !listtocitems.get(position).parent) {
            itemNumber.setVisibility(View.VISIBLE);
            itemNumber.setText(String.valueOf(position + 1));
        } else if (itemNumber != null) {
            itemNumber.setVisibility(View.GONE);
        }

        if (!listtocitems.get(position).parent) {

            RelativeLayout item = holder.itemView.findViewById(R.id.item_activity);
            TimelineView mTimelineView = holder.itemView.findViewById(R.id.timeline);
            ImageView arrow = holder.itemView.findViewById(R.id.goArrow);
            /*
             * if (textViewTitle.getText().toString().startsWith("Unidad")){
             * mTimelineView.getMarker().setVisible(false,false);
             * picture.setImageDrawable(context.getDrawable(R.drawable.rocket));
             * chipEstado.setVisibility(View.GONE);
             * arrow.setVisibility(View.GONE);
             * }
             */
            switch (listtocitems.get(position).state) {
                case "completed":
                    // item.setBackground(context.getDrawable(R.drawable.toc_complete));
                    mTimelineView.setMarker(context.getDrawable(R.drawable.ic_icono_check_completado_37x37));

                    statusText.setText("Completado");
                    chipEstado.setBackground(holder.itemView.getResources().getDrawable(R.drawable.complete_card));
                    break;

                case "incomplete":
                    // item.setBackground(context.getDrawable(R.drawable.toc_current));
                    mTimelineView.setMarker(context.getDrawable(R.drawable.ic_icono_check_en_curso_37x37));

                    statusText.setText("En curso");
                    chipEstado.setBackground(holder.itemView.getResources().getDrawable(R.drawable.incourse_card));
                    break;

                case "passed":
                    // item.setBackground(context.getDrawable(R.drawable.toc_passed));

                    statusText.setText("Completado");
                    chipEstado.setBackground(holder.itemView.getResources().getDrawable(R.drawable.complete_card));
                    break;

                case "failed":
                    // item.setBackground(context.getDrawable(R.drawable.toc_fail));

                    chipEstado.setBackground(holder.itemView.getResources().getDrawable(R.drawable.failed_card));
                    statusText.setText("Fallido");
                    break;

                case "unknown":
                case "not attempted":
                default:
                    // item.setBackground(context.getDrawable(R.drawable.toc_unknown));
                    mTimelineView.setMarker(context.getDrawable(R.drawable.ic_icono_check_no_iniciado_37x37));

                    statusText.setText("No iniciado");
                    chipEstado.setBackground(holder.itemView.getResources().getDrawable(R.drawable.notstart_card));
                    // picture.setColorFilter(R.color.black);
                    break;
            }

            item.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent i = new Intent(context, CursoActivity.class);
                    bundle.putString("identifier", listtocitems.get(position).identifier);
                    bundle.putString("identifierref", listtocitems.get(position).identifierref);
                    i.putExtras(bundle);
                    context.startActivity(i);
                }
            });
        } else {
            if (listtocitems.get(position).depth == 3) {
                LinearLayout title = holder.itemView.findViewById(R.id.item_title);
                title.setBackgroundColor(context.getResources().getColor(R.color.md_blue_400));
            }
        }

        // Lógica para el botón "Ir a otros"
        View btnIrAOtros = holder.itemView.findViewById(R.id.btn_ir_a_otros);
        if (btnIrAOtros != null) {
            btnIrAOtros.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(context,
                            cl.dl_distancia_a481.player_tablet.activities.EventsActivity.class);
                    context.startActivity(intent);
                }
            });
        }
    }

    // Return the size of your dataset (invoked by the layout manager)

    // Provide a reference to the views for each data item
    // Complex data items may need more than one view per item, and
    // you provide access to all the views for a data item in a view holder

}
