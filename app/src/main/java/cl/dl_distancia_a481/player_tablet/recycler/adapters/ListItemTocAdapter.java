package cl.dl_distancia_a481.player_tablet.recycler.adapters;

import android.util.Log;

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
    private static final int VIEW_TYPE_HEADER = 2;

    private int progresoCurso = 0;
    private int number = 0;
    Context context;
    Bundle bundle;

    class ViewHolder extends RecyclerView.ViewHolder {
        final ListItemTocAdapter mAdapter;
        public TimelineView mTimelineView;

        public ViewHolder(View itemView, ListItemTocAdapter adapter, int viewType) {
            super(itemView);
            this.mAdapter = adapter;

            if (viewType != VIEW_TYPE_HEADER) {
                mTimelineView = itemView.findViewById(R.id.timeline);
                if (this.mTimelineView != null) {
                    this.mTimelineView.initLine(viewType);
                }
            }
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

        // DEBUG: imprimir toda la lista
        for (TocItem item : listtocitems) {
            Log.d("TOC_ITEM", "Name: " + item.name + ", ID: " + item.identifier + ", ParentID: " + item.parentidentifier
                    + ", IsParent: " + item.parent);
        }
    }

    // Create new views. This is invoked by the layout manager.
    @Override
    public ListItemTocAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View v;
        switch (viewType) {
            case 0:
                v = mInflater.inflate(R.layout.item_activity, parent, false);
                break;
            case 1:
                v = mInflater.inflate(R.layout.item_parent_card, parent, false);
                break;
            case VIEW_TYPE_HEADER:
                v = mInflater.inflate(R.layout.item_header, parent, false);
                return new ViewHolder(v, this, viewType); // header no necesita TimelineView
            default:
                v = mInflater.inflate(R.layout.item_activitytitle, parent, false);
                break;
        }
        return new ViewHolder(v, this, viewType);
    }

    @Override
    public int getItemCount() {
        return listtocitems.size() + 1;
    }

    @Override
    public int getItemViewType(int position) {
        if (position == 0)
            return VIEW_TYPE_HEADER;
        TocItem item = listtocitems.get(position - 1); // Ajustado
        return item.parent ? 1 : 0;
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {
        if (getItemViewType(position) == VIEW_TYPE_HEADER) {
            View btnIrAOtros = holder.itemView.findViewById(R.id.btn_ir_a_otros);
            if (btnIrAOtros != null) {
                btnIrAOtros.setOnClickListener(v -> {
                    Intent intent = new Intent(context,
                            cl.dl_distancia_a481.player_tablet.activities.EventsActivity.class);
                    context.startActivity(intent);
                });
            }
            return;
        }

        final int realPosition = position - 1;
        TocItem currentItem = listtocitems.get(realPosition);

        if (holder.mTimelineView != null) {
            boolean parentIsVisible = tieneParentVisible(currentItem.parentidentifier, position);

            // OJO: forzar ocultar si no existe el parent en la lista
            boolean parentExists = parentidentifierExiste(currentItem.parentidentifier);

            if (parentIsVisible && parentExists) {
                holder.mTimelineView.setVisibility(View.VISIBLE);
            } else {
                holder.mTimelineView.setVisibility(View.GONE);
            }
        }

        // Número secuencial si no es parent
        TextView textViewNumber = holder.itemView.findViewById(R.id.number);
        if (textViewNumber != null && !currentItem.parent) {
            int index = getCourseIndex(position);
            textViewNumber.setText(String.format("%02d", index));
        }

        TextView progresoText = holder.itemView.findViewById(R.id.itemProgress);
        ProgressBar progresoBar = holder.itemView.findViewById(R.id.itemProgressBar);
        if (progresoText != null && progresoBar != null) {
            switch (currentItem.state) {
                case "completed":
                case "passed":
                    progresoText.setText("100%");
                    progresoBar.setProgress(100);
                    break;
                case "incomplete":
                    progresoText.setText("50%");
                    progresoBar.setProgress(50);
                    break;
                case "failed":
                    progresoText.setText("25%");
                    progresoBar.setProgress(25);
                    break;
                default:
                    progresoText.setText("0%");
                    progresoBar.setProgress(0);
                    break;
            }
        }

        TextView textViewTitle = holder.itemView.findViewById(R.id.item_name);
        if (textViewTitle != null) {
            textViewTitle.setText(currentItem.name);
        }

        RelativeLayout chipEstado = holder.itemView.findViewById(R.id.chip_estado);
        TextView statusText = holder.itemView.findViewById(R.id.statusText);
        TextView itemNumber = holder.itemView.findViewById(R.id.item_number);
        if (itemNumber != null) {
            if (!currentItem.parent) {
                itemNumber.setVisibility(View.VISIBLE);
                itemNumber.setText(String.valueOf(realPosition + 1));
            } else {
                itemNumber.setVisibility(View.GONE);
            }
        }

        if (!currentItem.parent) {
            RelativeLayout item = holder.itemView.findViewById(R.id.item_activity);

            // Si no tiene parentidentifier, ocultar el timeline completamente
            if (currentItem.parentidentifier == null || currentItem.parentidentifier.isEmpty()) {
                if (holder.mTimelineView != null) {
    boolean parentIsVisible = tieneParentVisible(currentItem.parentidentifier, position);
    boolean parentExists = parentidentifierExiste(currentItem.parentidentifier);

    if (parentIsVisible && parentExists) {
        holder.mTimelineView.setVisibility(View.VISIBLE);

        // Configurar marcador según el estado
        switch (currentItem.state) {
            case "completed":
                holder.mTimelineView.setMarker(context.getDrawable(R.drawable.ic_icono_check_completado_37x37));
                statusText.setText("Completado");
                chipEstado.setBackgroundResource(R.drawable.complete_card);
                break;
            case "incomplete":
                holder.mTimelineView.setMarker(context.getDrawable(R.drawable.ic_icono_check_en_curso_37x37));
                statusText.setText("En curso");
                chipEstado.setBackgroundResource(R.drawable.incourse_card);
                break;
            case "passed":
                statusText.setText("Completado");
                chipEstado.setBackgroundResource(R.drawable.complete_card);
                break;
            case "failed":
                chipEstado.setBackgroundResource(R.drawable.failed_card);
                statusText.setText("Fallido");
                break;
            default:
                holder.mTimelineView.setMarker(null);
                statusText.setText("No iniciado");
                chipEstado.setBackgroundResource(R.drawable.notstart_card);
                break;
        }
    } else {
        holder.mTimelineView.setVisibility(View.GONE);
    }
}
            }

            item.setOnClickListener(v -> {
                Intent i = new Intent(context, CursoActivity.class);
                Bundle newBundle = new Bundle(bundle);
                newBundle.putString("identifier", currentItem.identifier);
                newBundle.putString("identifierref", currentItem.identifierref);
                i.putExtras(newBundle);
                context.startActivity(i);
            });
        } else {
            // Item tipo parent
            TextView titleText = holder.itemView.findViewById(R.id.item_name);
            if (titleText != null) {
                titleText.setText(currentItem.name);
            }

            ProgressBar progressBar = holder.itemView.findViewById(R.id.parentProgressBar);
            TextView progressText = holder.itemView.findViewById(R.id.parentProgressText);
            if (progressBar != null && progressText != null) {
                float progreso = getProgresoParaParent(currentItem.identifier);
                progressBar.setProgress((int) progreso);
                progressText.setText(String.format("%.0f%%", progreso));
            }

            if (currentItem.depth == 3) {
                LinearLayout title = holder.itemView.findViewById(R.id.item_title);
                if (title != null) {
                    title.setBackgroundColor(context.getResources().getColor(R.color.md_blue_400));
                }
            }
        }
    }

    private int getCourseIndex(int position) {
        int count = 0;
        for (int i = 0; i < position; i++) {
            if (i == 0)
                continue; // Saltar el header
            TocItem item = listtocitems.get(i - 1); // ajustar por el header
            if (!item.parent) {
                count++;
            }
        }
        return count + 1; // El +1 es porque queremos el índice del actual
    }

    private float getProgresoParaParent(String parentId) {
        int total = 0;
        int completos = 0;

        for (TocItem item : listtocitems) {
            if (!item.parent && item.parentidentifier != null && item.parentidentifier.equals(parentId)) {
                total++;
                if ("completed".equals(item.state) || "passed".equals(item.state)) {
                    completos++;
                }
            }
        }

        return total == 0 ? 0 : (completos * 100f / total);
    }

    private boolean tieneParentVisible(String parentId, int adapterPosition) {
        if (parentId == null || parentId.isEmpty())
            return false;

        int realChildPos = adapterPosition - 1;

        // Recorremos desde el inicio hasta justo antes del hijo
        for (int i = 0; i < realChildPos; i++) {
            TocItem item = listtocitems.get(i);
            if (item.parent && parentId.equals(item.identifier)) {
                return true; // El parent existe Y está antes del hijo
            }
        }

        return false; // No se encontró un parent antes del hijo
    }

    private boolean parentidentifierExiste(String parentId) {
        if (parentId == null || parentId.isEmpty())
            return false;

        for (TocItem item : listtocitems) {
            if (item.identifier.equals(parentId) && item.parent) {
                return true;
            }
        }
        return false;
    }

    // Return the size of your dataset (invoked by the layout manager)

    // Provide a reference to the views for each data item
    // Complex data items may need more than one view per item, and
    // you provide access to all the views for a data item in a view holder

}