package cl.dl_distancia_a481.player_tablet.recycler.adapters;
import cl.dl_distancia_a481.player_tablet.activities.DashboardActivity;

import android.util.Log;
import android.util.TypedValue;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import androidx.constraintlayout.widget.ConstraintLayout;
import com.google.android.material.card.MaterialCardView;
import android.content.res.Resources;

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
import cl.dl_distancia_a481.player_tablet.activities.TocActivity;
import cl.dl_distancia_a481.player_tablet.utils.TocItem;

public class ListItemTocAdapter extends RecyclerView.Adapter<ListItemTocAdapter.ViewHolder> {

    private ArrayList<TocItem> listtocitems;
    private final LayoutInflater mInflater;
    private static final int VIEW_TYPE_HEADER = 2;
    private static final int VIEW_TYPE_FOOTER = 3;

    private int progresoCurso = 0;
    private int number = 0;
    Context context;
    Bundle bundle;

    class ViewHolder extends RecyclerView.ViewHolder {
        public View connector;
        final ListItemTocAdapter mAdapter;
        public TimelineView mTimelineView;

        public ViewHolder(View itemView, ListItemTocAdapter adapter, int viewType) {
            super(itemView);
            this.mAdapter = adapter;

            if (viewType != VIEW_TYPE_HEADER) {
                mTimelineView = itemView.findViewById(R.id.timeline);
                connector = itemView.findViewById(R.id.connector);

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
            case VIEW_TYPE_FOOTER:
                View spacer = new View(parent.getContext());
                spacer.setLayoutParams(new RecyclerView.LayoutParams(
                        RecyclerView.LayoutParams.MATCH_PARENT, 200));
                return new ViewHolder(spacer, this, VIEW_TYPE_FOOTER);

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
        return listtocitems.size() + 2;
    }

    @Override
    public int getItemViewType(int position) {
        if (position == 0)
            return VIEW_TYPE_HEADER;
        if (position == listtocitems.size() + 1)
            return VIEW_TYPE_FOOTER;

        TocItem item = listtocitems.get(position - 1); // seguro ahora
        return item.parent ? 1 : 0;
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {

        if (getItemViewType(position) == VIEW_TYPE_FOOTER) {
            // Footer vacío, sin bind
            holder.itemView.setVisibility(View.INVISIBLE); // O View.GONE si prefieres
            holder.itemView.setLayoutParams(new RecyclerView.LayoutParams(
                    RecyclerView.LayoutParams.MATCH_PARENT, 200)); // Altura visible del footer
            return;
        }

        if (getItemViewType(position) == VIEW_TYPE_HEADER) {
            View btnIrAOtros = holder.itemView.findViewById(R.id.btn_ir_a_otros);
            if (btnIrAOtros != null) {
                btnIrAOtros.setOnClickListener(v -> {
                    boolean fromEventsWithOneItem = bundle.getBoolean("fromEventsWithOneItem", false);

                    if (fromEventsWithOneItem) {
                        ((TocActivity) context).skipAutoReturn = true;
                        Intent i = new Intent(context, DashboardActivity.class);
                        i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK // borra TODA la pila
                                | Intent.FLAG_ACTIVITY_NEW_TASK); // crea un task nuevo con Dashboard
                        context.startActivity(i);
                        // ya no hace falta finish(): CLEAR_TASK elimina TocActivity

                        if (context instanceof android.app.Activity) {
                            ((android.app.Activity) context).finish();
                        }
                    } else {
                        if (context instanceof android.app.Activity) {
                            ((android.app.Activity) context).finish();
                        }
                    }
                });

            }
            return;
        }
        if (getItemViewType(position) == VIEW_TYPE_FOOTER) {
            // Footer invisible de 200dp
            holder.itemView.setVisibility(View.INVISIBLE);
            holder.itemView.setLayoutParams(new RecyclerView.LayoutParams(
                    RecyclerView.LayoutParams.MATCH_PARENT, 200));
            return;
        }
        final int realPosition = position - 1;
        TocItem currentItem = listtocitems.get(realPosition);
        View connector = holder.itemView.findViewById(R.id.connector);
        boolean isStandalone = !currentItem.parent && (currentItem.parentidentifier == null ||
                currentItem.parentidentifier.isEmpty() ||
                !tieneParentVisible(currentItem.parentidentifier, position));

        if (currentItem.parent) {

            // Aplicar márgenes laterales uniformes a los parent, como los standalone
            MaterialCardView card = holder.itemView.findViewById(R.id.parent_cardView);
            if (card != null) {
                ViewGroup.MarginLayoutParams params = (ViewGroup.MarginLayoutParams) card.getLayoutParams();

                int margin = (int) TypedValue.applyDimension(
                        TypedValue.COMPLEX_UNIT_DIP,
                        100, // mismo margen que standalone
                        context.getResources().getDisplayMetrics());

                params.setMargins(margin, params.topMargin, margin, params.bottomMargin);
                card.setLayoutParams(params);
            }

            ImageView goArrow = holder.itemView.findViewById(R.id.goArrow);
            if (goArrow != null)
                goArrow.setVisibility(View.GONE);

            if (holder.mTimelineView != null) {
                holder.mTimelineView.setVisibility(View.GONE);
            }

            if (!isStandalone && connector != null && holder.mTimelineView != null) {
                if (holder.mTimelineView.getVisibility() == View.VISIBLE) {
                    connector.setVisibility(View.VISIBLE);
                    holder.mTimelineView.post(() -> {
                        int tlHeight = holder.mTimelineView.getMeasuredHeight();
                        int connHeight = connector.getMeasuredHeight();
                        int topMargin = (tlHeight - connHeight) / 2;
                        LinearLayout.LayoutParams lp = (LinearLayout.LayoutParams) connector.getLayoutParams();
                        lp.topMargin = topMargin;
                        connector.setLayoutParams(lp);
                    });
                } else {
                    connector.setVisibility(View.GONE);
                }
            } else if (connector != null) {
                connector.setVisibility(View.GONE);
            }

            TextView tvNumber = holder.itemView.findViewById(R.id.number);
            if (tvNumber != null) {
                int parentIdx = getParentIndex(position);
                tvNumber.setText(String.format("%02d", parentIdx));
                tvNumber.setVisibility(View.VISIBLE);
            }

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
            return;
        }

        // Hijos
        TextView tvNumber = holder.itemView.findViewById(R.id.number);
        if (tvNumber != null) {
            tvNumber.setVisibility(View.GONE);
        }

        View childProgressContainer = holder.itemView.findViewById(R.id.progress_container);
        if (childProgressContainer != null) {
            childProgressContainer.setVisibility(View.GONE);
        }

        if (holder.mTimelineView != null) {
            if (isStandalone) {
                holder.mTimelineView.setVisibility(View.GONE);
            } else {
                boolean parentIsVisible = tieneParentVisible(currentItem.parentidentifier, position);
                boolean parentExists = parentidentifierExiste(currentItem.parentidentifier);
                holder.mTimelineView.setVisibility(parentIsVisible && parentExists
                        ? View.VISIBLE
                        : View.GONE);
            }
        }

        // Corregido: controlar visibilidad del connector en hijos también
        if (connector != null) {
            if (isStandalone) {
                connector.setVisibility(View.GONE);
            } else {
                boolean parentIsVisible = tieneParentVisible(currentItem.parentidentifier, position);
                boolean parentExists = parentidentifierExiste(currentItem.parentidentifier);
                connector.setVisibility(parentIsVisible && parentExists ? View.VISIBLE : View.GONE);
            }
        }

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
            MaterialCardView card = holder.itemView.findViewById(R.id.content_cardView);
            if (card != null) {
                ConstraintLayout fullContainer = holder.itemView.findViewById(R.id.item_activity_full);
                if (fullContainer != null) {
                    LinearLayout.LayoutParams lp = (LinearLayout.LayoutParams) fullContainer.getLayoutParams();

                    if (!isStandalone) {
                        // Cambia ancho a MATCH_PARENT y aplica margenStart de 100dp
                        lp.width = LinearLayout.LayoutParams.MATCH_PARENT;

                        int marginStartPx = (int) TypedValue.applyDimension(
                                TypedValue.COMPLEX_UNIT_DIP,
                                -80,
                                context.getResources().getDisplayMetrics());
                        lp.setMarginStart(marginStartPx);
                    } else {
                        // Standalone sin margen
                        lp.setMarginStart(0);
                    }

                    fullContainer.setLayoutParams(lp);
                    fullContainer.requestLayout();
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
        }

        switch (currentItem.state) {
            case "completed":
                statusText.setText("Completado");
                chipEstado.setBackgroundResource(R.drawable.complete_card);
                break;
            case "incomplete":
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
                statusText.setText("No iniciado");
                chipEstado.setBackgroundResource(R.drawable.notstart_card);
                break;
        }

        if (holder.mTimelineView != null) {
            int timelineType = TimelineView.getTimeLineViewType(
                    position - 1,
                    getItemCount() - 1);
            holder.mTimelineView.initLine(timelineType);
            holder.mTimelineView.setMarker(null);
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

    /**
     * Devuelve la posición (1-based) del parent actual
     * contando solo los TocItem.parent==true hasta adapterPosition.
     */
    private int getParentIndex(int adapterPosition) {
        // adapterPosition incluye el header, así que el real es -1
        int realPos = adapterPosition - 1;
        int count = 0;
        for (int i = 0; i < listtocitems.size(); i++) {
            TocItem item = listtocitems.get(i);
            if (item.parent) {
                count++;
            }
            if (i == realPos)
                break;
        }
        return count;
    }

    // Return the size of your dataset (invoked by the layout manager)

    // Provide a reference to the views for each data item
    // Complex data items may need more than one view per item, and
    // you provide access to all the views for a data item in a view holder

}