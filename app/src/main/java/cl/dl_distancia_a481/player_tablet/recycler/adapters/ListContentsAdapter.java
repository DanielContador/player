package cl.dl_distancia_a481.player_tablet.recycler.adapters;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.TypedValue;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;


import java.util.ArrayList;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.activities.TocActivity;
import cl.dl_distancia_a481.player_tablet.recycler.classes.Content;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;

import static xdroid.toaster.Toaster.toast;

public class ListContentsAdapter extends RecyclerView.Adapter<ListContentsAdapter.ViewHolder> {

    // Variable para controlar el valor por defecto de vertical
    public static final boolean DEFAULT_VERTICAL = false;

    private ArrayList<Content> listcontents;
    Context context;
    private DbHelper dbHelper;
    private boolean vertical = DEFAULT_VERTICAL; // Usar la variable aquí


    private final View.OnClickListener onClickList = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Toast.makeText(context, "Clicked", Toast.LENGTH_SHORT).show();
        }
    };


    // Constructor con flag vertical
    public ListContentsAdapter(Context context, ArrayList<Content> listcontents, boolean vertical) {
        this.listcontents = listcontents;
        this.context = context;
        this.vertical = vertical;
    }

    // Constructor adicional para compatibilidad con código existente
    public ListContentsAdapter(Context context, ArrayList<Content> listcontents) {
        this(context, listcontents, DEFAULT_VERTICAL);
    }

    // Create new views. This is invoked by the layout manager.
    @Override
    public ListContentsAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // Create a new view by inflating the row item xml.
        View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_content, parent, false);
        //v.setOnClickListener(onClickList);

        return new ViewHolder(v);
    }

    public int calculatePercent(String item) {
        dbHelper = DbHelper.getHelper(context);
        int pertcentTotal = dbHelper.GetTotalPorcent(item);
        return pertcentTotal;
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(@NonNull final ViewHolder holder, final int position) {

        TextView textViewTitle;

        RelativeLayout item_lect = holder.view.findViewById(R.id.content_item);
        RelativeLayout item_eval = holder.view.findViewById(R.id.content_item_eval);

        item_lect.setBackgroundColor(holder.view.getResources().getColor(android.R.color.white));
        // NUEVO: Referencia al nuevo contenedor derecho
        RelativeLayout rightContainer = holder.view.findViewById(R.id.right_container);

        // NUEVO: Actualiza la barra de progreso y el porcentaje
        ProgressBar progressBar = holder.view.findViewById(R.id.totalProgressBar_item);
        TextView progressPercent = holder.view.findViewById(R.id.totalProgress_item);

        int value = calculatePercent(String.valueOf(listcontents.get(position).getid()));
        if (progressBar != null) progressBar.setProgress(value);
        if (progressPercent != null) progressPercent.setText(value + "%");

        if (listcontents.get(position).getEvalua() == 1) {
            item_lect.setVisibility(View.GONE);
            item_eval.setVisibility(View.VISIBLE);
            textViewTitle = holder.view.findViewById(R.id.textViewItemTitle_eval);
            //textViewDescription = holder.view.findViewById(R.id.textViewItemContent_eval);

            TextView intentos = holder.view.findViewById(R.id.intentos);
            intentos.setText(String.valueOf(listcontents.get(position).getIntentos()) + " de " +
                    String.valueOf(listcontents.get(position).getMax_intentos()) + " Intentos");

            TextView nota = holder.view.findViewById(R.id.porcent);
            nota.setText(String.valueOf("Nota " + listcontents.get(position).getPuntaje()) + "%");

            RelativeLayout estadoEval = holder.view.findViewById(R.id.estado_eval);
            TextView estadoTextEval = holder.view.findViewById(R.id.statusEvalText);
            switch (listcontents.get(position).getSituacion()) {
                //if not final situation(NO_INIT or CURRENT)
                case 0:
                    switch (listcontents.get(position).getEstado()) {
                        case 0://No info or No Intent
                        case 1:
                            estadoEval.setBackground(holder.view.getResources().getDrawable(R.drawable.notstart_card));
                            estadoTextEval.setText("No Intentado");
                            //estado.setBackgroundColor(holder.view.getResources().getColor(R.color.md_blue_grey_300));
                            break;

                        default:
                            estadoEval.setBackground(holder.view.getResources().getDrawable(R.drawable.incourse_card));
                            estadoTextEval.setText("En Curso");
                            //estado.setBackgroundColor(holder.view.getResources().getColor(R.color.md_yellow_300));
                            break;
                    }
                    break;
                case 1:
                    estadoTextEval.setText("Aprobado");
                    estadoEval.setBackground(holder.view.getResources().getDrawable(R.drawable.complete_card));
                    //estado.setBackgroundColor(holder.view.getResources().getColor(R.color.md_green_500));
                    break;
                default:
                    estadoTextEval.setText("Reprobado");
                    estadoEval.setBackground(holder.view.getResources().getDrawable(R.drawable.notstart_card));
                    break;
            }
        } else {
            item_lect.setVisibility(View.VISIBLE);
            item_eval.setVisibility(View.GONE);
            // NUEVO: Busca el título en el contenedor correcto
            //textViewDescription = holder.view.findViewById(R.id.textViewItemContent);

            switch (listcontents.get(position).getEstado()) {
                /*case 1:
                    estado.setText("No\n Intentado");
                    estado.setBackgroundColor(holder.view.getResources().getColor(R.color.md_blue_grey_300));
                    break;*/
                case 2:
                    // estado.setBackground(holder.view.getResources().getDrawable(R.drawable.incourse_card));
                    // estadoText.setText("En Curso");
                    break;
                case 3:
                    // estado.setBackground(holder.view.getResources().getDrawable(R.drawable.complete_card));
                    // estadoText.setText("Completado");
                    break;
                default:
                    // estado.setBackground(holder.view.getResources().getDrawable(R.drawable.notstart_card));
                    // estadoText.setText("No Intentado");
                    break;
            }
        }
        TextView itemNumber = holder.itemView.findViewById(R.id.item_number);
        itemNumber.setText(String.valueOf(position + 1));

        // NUEVO: Referencia al fondo como imagen
        ImageView bgLeftImage = holder.view.findViewById(R.id.bg_left_image);

        // Cambiar fondo si vertical es true
        if (vertical && item_lect != null) {
    if (bgLeftImage != null) {
        bgLeftImage.setVisibility(View.VISIBLE);

        ViewGroup.LayoutParams imgParams = bgLeftImage.getLayoutParams();

        // Asegúrate de castear correctamente para poder modificar márgenes
        if (imgParams instanceof ViewGroup.MarginLayoutParams) {
            ViewGroup.MarginLayoutParams marginParams = (ViewGroup.MarginLayoutParams) imgParams;

            // Cambiar tamaño
            marginParams.width = (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, 300, holder.view.getResources().getDisplayMetrics());
            marginParams.height = (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, 300, holder.view.getResources().getDisplayMetrics());

            // Cambiar marginStart
            marginParams.setMarginStart((int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, 30, holder.view.getResources().getDisplayMetrics()));

            bgLeftImage.setLayoutParams(marginParams);
        }
    }


            //item_lect.setBackground(holder.view.getResources().getDrawable(R.drawable.bg_left)); // Quitar esto

            ViewGroup.LayoutParams params = item_lect.getLayoutParams();
            params.width = (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, 
                3, 
                holder.view.getResources().getDisplayMetrics()
            );
            params.height = (int) TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP, 
                500, 
                holder.view.getResources().getDisplayMetrics()
            );
            item_lect.setLayoutParams(params);
            // Mostrar el contenedor derecho y ajustar tamaño cuadrado
            if (rightContainer != null) {
                rightContainer.setVisibility(View.VISIBLE);
            }
        } else {
            // Ocultar la imagen de fondo
            if (bgLeftImage != null) {
                bgLeftImage.setVisibility(View.GONE);
            }
            // Ocultar el contenedor derecho y dejar layout normal
            if (rightContainer != null) {
                rightContainer.setVisibility(View.GONE);
            }
            // Restaurar tamaño original de content_item
            ViewGroup.LayoutParams params = item_lect.getLayoutParams();
            if (params != null) {
                params.width = ViewGroup.LayoutParams.MATCH_PARENT;
                params.height = ViewGroup.LayoutParams.MATCH_PARENT;
                item_lect.setLayoutParams(params);
            }
        }

        final Bundle b = new Bundle();
        RelativeLayout item = holder.view.findViewById(R.id.item_content);
        item.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (!listcontents.get(position).getPuede()) {
                    toast("Máximo número de intentos alcanzado");
                    return;
                }


                b.putInt("IdContent", listcontents.get(position).getid());
                b.putInt("IdEvent", listcontents.get(position).getId_evento());
                b.putString("Path", listcontents.get(position).getPath());
                b.putInt("IdCurso", listcontents.get(position).getId_curso());
                b.putInt("isEval", listcontents.get(position).getEvalua());

                Intent i = new Intent(context, TocActivity.class);
                i.putExtras(b);
                context.startActivity(i);
            }
        });

    }


    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return listcontents.size();
    }

    // Provide a reference to the views for each data item
    // Complex data items may need more than one view per item, and
    // you provide access to all the views for a data item in a view holder
    public static class ViewHolder extends RecyclerView.ViewHolder {
        // each data item is just a string in this case
        public View view;

        public ViewHolder(View v) {
            super(v);
            view = v;
        }
    }
}
