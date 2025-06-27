package cl.dl_distancia_a481.player_tablet.recycler.adapters;

import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.FrameLayout;
import android.view.Gravity;
import android.util.TypedValue;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import android.widget.LinearLayout;

import android.view.ViewGroup;
import android.widget.TextView;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;
import cl.dl_distancia_a481.player_tablet.recycler.classes.Content;
import cl.dl_distancia_a481.player_tablet.utils.CombinedItem;
import cl.dl_distancia_a481.player_tablet.utils.TocItem;

import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.classes.Content;
import android.content.Intent;
import android.os.Bundle;
import cl.dl_distancia_a481.player_tablet.activities.CursoActivity;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;

public class CombinedCoursesAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private List<CombinedItem> items;
    private static final int VIEW_TYPE_HEADER = 4;

    private static final int SHIFT_PX = 300;
    private static final int SHIFT_PX2 = 500;
    private static final int HEIGHT_DP = 210;
    private static final int VIEW_TYPE_COURSE = 0;
    private static final int VIEW_TYPE_ACTIVITY = 1;

    private static final int VIEW_TYPE_FOOTER = 2;

    private static final int VIEW_TYPE_SPACER = 3;
    private RecyclerView recycler;

    private Context context;

    public CombinedCoursesAdapter(Context ctx, List<CombinedItem> items, RecyclerView rv) {
        this.context = ctx;
        this.items = items;
        this.recycler = rv;
    }

    @Override
    public int getItemViewType(int position) {
        switch (items.get(position).getType()) {
            case COURSE:
                return VIEW_TYPE_COURSE;
            case ACTIVITY:
                return VIEW_TYPE_ACTIVITY;
            case FOOTER:
                return VIEW_TYPE_FOOTER;
            case SPACER:
                return VIEW_TYPE_SPACER;
            case HEADER:
                return VIEW_TYPE_HEADER; // nuevo
            default:
                throw new IllegalArgumentException("Invalid type");
        }
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(parent.getContext());

        if (viewType == VIEW_TYPE_COURSE) {
            View view = inflater.inflate(R.layout.item_combined_course, parent, false);
            return new CourseViewHolder(view);

        } else if (viewType == VIEW_TYPE_ACTIVITY) {
            View view = inflater.inflate(R.layout.item_combined_activity, parent, false);
            return new CombinedActivityViewHolder(view);

        } else if (viewType == VIEW_TYPE_FOOTER) {
            View view = inflater.inflate(R.layout.item_footer, parent, false);
            return new FooterViewHolder(view);

        } else if (viewType == VIEW_TYPE_HEADER) {
            View view = inflater.inflate(R.layout.item_combined_header, parent, false);
            return new HeaderViewHolder(view);
        }

        else if (viewType == VIEW_TYPE_SPACER) {
            // vista vacía de 0 px de alto
            View v = new View(parent.getContext());
            v.setLayoutParams(new RecyclerView.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT, 0));
            return new RecyclerView.ViewHolder(v) {
            };
        }

        throw new RuntimeException("Unknown view type");
    }

    // Dentro de CombinedCoursesAdapter

    // CombinedCoursesAdapter.java

    // CombinedCoursesAdapter.java

    /*-----------------------------------------------------------*
    *   MÉTODO PRINCIPAL                                        *
    *-----------------------------------------------------------*/
    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder,
            int position) {
        CombinedItem ci = items.get(position);
        int type = getItemViewType(position);

        /*------------- 0. Numeración de cursos ------------------*/
        int courseNumber = 0;
        if (type == VIEW_TYPE_COURSE) {
            for (int i = 0; i <= position; i++) {
                if (items.get(i).getType() == CombinedItem.Type.COURSE)
                    courseNumber++;
            }
        }

        /*------------- 1. Altura fija (salvo SPACER) ------------*/
        if (type != VIEW_TYPE_SPACER) {
            int hPx = (int) TypedValue.applyDimension(
                    TypedValue.COMPLEX_UNIT_DIP, HEIGHT_DP,
                    context.getResources().getDisplayMetrics());

            ViewGroup.LayoutParams lp = holder.itemView.getLayoutParams();
            if (lp == null)
                lp = new RecyclerView.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT, hPx);
            else
                lp.height = hPx;
            holder.itemView.setLayoutParams(lp);
        }

        /*------------- 2. Desbloqueo secuencial -----------------*/
        boolean unlockedActivity = true;
        boolean unlockedCourse = true;

        if (type == VIEW_TYPE_ACTIVITY) {

            /* ACTIVITY se desbloquea si la actividad previa está completada */
            unlockedActivity = unlockedAfterPrevActivity(position);

        } else if (type == VIEW_TYPE_COURSE) {

            /* 1) Comprueba si la actividad ANTERIOR pertenece a esta misma fila */
            boolean assocUnlocked = false;
            if (position > 0 && items.get(position - 1).getType() == CombinedItem.Type.ACTIVITY) {
                assocUnlocked = unlockedAfterPrevActivity(position - 1);
            }

            /* 2) Si no la encontró, mira la actividad POSTERIOR */
            if (!assocUnlocked &&
                    position + 1 < items.size() &&
                    items.get(position + 1).getType() == CombinedItem.Type.ACTIVITY) {
                assocUnlocked = unlockedAfterPrevActivity(position + 1);
            }

            /* 3) El curso se colorea si la actividad asociada está desbloqueada */
            unlockedCourse = assocUnlocked;
        }

        /* FOOTER mantiene su lógica de antes -------------------- */
        boolean unlockedFooter = true;
        if (type == VIEW_TYPE_FOOTER) {
            int coursePos = -1;
            for (int i = position - 1; i >= 0; i--) {
                if (items.get(i).getType() == CombinedItem.Type.COURSE) {
                    coursePos = i;
                    break;
                }
            }
            if (coursePos != -1) {
                int act = 0, done = 0;
                for (int i = coursePos + 1; i < position; i++) {
                    if (items.get(i).getType() == CombinedItem.Type.ACTIVITY) {
                        act++;
                        TocItem t = items.get(i).getActivity();
                        if ("completed".equals(t.state) || "passed".equals(t.state))
                            done++;
                    }
                }
                unlockedFooter = (act == 0) || (done == act);
            }
        }

        /*------------- 3. Vista según tipo ----------------------*/
        switch (type) {

            /*------ CURSO -------*/
            case VIEW_TYPE_COURSE: {
                CourseViewHolder vh = (CourseViewHolder) holder;
                vh.title.setText(ci.getCourse().getNombre());
                vh.description.setText(ci.getCourse().getDescription());
                vh.itemNumber.setText(String.format("%02d", courseNumber));

                if (position + 1 < items.size()
                        && items.get(position + 1).getType() == CombinedItem.Type.ACTIVITY) {
                    // si esa actividad ya está desbloqueada, desbloquea también el curso-etiqueta
                    boolean nextActUnlocked = unlockedAfterPrevActivity(position + 1);
                    if (nextActUnlocked)
                        unlockedCourse = true;
                }
                /* Zig-zag */
                int idx = 0;
                for (int i = position - 1; i >= 0; i--) {
                    if (items.get(i).getType() == CombinedItem.Type.FOOTER)
                        break;
                    if (items.get(i).getType() == CombinedItem.Type.COURSE)
                        idx++;
                }
                boolean left = (idx % 2 == 0);
                if (left) {
                    vh.background.setImageResource(R.drawable.bg_left);
                    pegadoDerecha(vh.itemView);
                    vh.coursecontainer.setTranslationX(0);
                    vh.coursecontainer.setTranslationY(-30);
                } else {
                    vh.background.setImageResource(R.drawable.bg_right);
                    vh.itemView.setTranslationX(-90);
                    vh.coursecontainer.setTranslationX(340);
                    vh.coursecontainer.setTranslationY(-70);
                }

                if (!unlockedCourse) {
                    // escala de grises de TODO el item (fondo + imágenes)
                    setGrayScaleAll(vh.itemView);
                    vh.itemView.setAlpha(0.5f);
                } else {
                    // restaurar a color
                    clearGrayScaleAll(vh.itemView);
                    vh.itemView.setAlpha(1f);
                }
                break;
            }

            /*------ ACTIVITY ------*/
            case VIEW_TYPE_ACTIVITY: {
                CombinedActivityViewHolder avh = (CombinedActivityViewHolder) holder;
                avh.bind(ci.getActivity());

                /* Zig-zag parcial */
                int idx = 0;
                for (int i = position - 1; i >= 0; i--) {
                    if (items.get(i).getType() == CombinedItem.Type.FOOTER)
                        break;
                    if (items.get(i).getType() == CombinedItem.Type.ACTIVITY)
                        idx++;
                }
                boolean left = (idx % 2 == 0);
                avh.rightContainer.setTranslationX(left ? 100 : 70);

                /* Botón */
                ImageView btn = avh.itemView.findViewById(R.id.buttonright);
                if (btn != null) {
                    if (!unlockedActivity)
                        setGrayScale(btn);
                    else
                        clearGrayScale(btn);
                }
                avh.itemView.setAlpha(unlockedActivity ? 1f : 0.5f);

                /* ───── Circulo que conecta con el elemento inferior (Course o Footer) ──── */
                ImageView circle = avh.itemView.findViewById(R.id.circulo_image);
                if (circle != null) {

                    boolean targetLocked = true; // por defecto gris

                    for (int j = position + 1; j < items.size(); j++) {

                        CombinedItem.Type t = items.get(j).getType();

                        if (t == CombinedItem.Type.COURSE) { // conecta con un COURSE
                            targetLocked = !isCourseTileUnlocked(j);
                            break;
                        }

                        if (t == CombinedItem.Type.FOOTER) { // conecta con el FOOTER
                            targetLocked = !isFooterUnlocked(j);
                            break;
                        }

                        if (t == CombinedItem.Type.FOOTER || // sección terminada → sin conexión
                                t == CombinedItem.Type.HEADER) {
                            break;
                        }
                    }

                    if (targetLocked) {
                        setGrayScale(circle);
                    } else {
                        clearGrayScale(circle);
                    }
                }

                /* Click */
                avh.itemView.setClickable(unlockedActivity);
                avh.itemView.setFocusable(unlockedActivity);
                if (unlockedActivity) {
                    avh.itemView.setOnClickListener(v -> {
                        TocItem toc = ci.getActivity();
                        Content course = null;
                        for (int i = position - 1; i >= 0; i--) {
                            if (items.get(i).getType() == CombinedItem.Type.COURSE) {
                                course = items.get(i).getCourse();
                                break;
                            }
                        }
                        if (course == null)
                            return;
                        Bundle b = new Bundle();
                        b.putInt("IdContent", course.getid());
                        b.putInt("IdEvent", course.getId_evento());
                        b.putString("Path", course.getPath());
                        b.putInt("IdCurso", course.getId_curso());
                        b.putInt("isEval", course.getEvalua());
                        b.putString("identifier", toc.identifier);
                        b.putString("identifierref", toc.identifierref);

                        Intent in = new Intent(context, CursoActivity.class);
                        in.putExtras(b);
                        context.startActivity(in);
                    });
                } else {
                    avh.itemView.setOnClickListener(null);
                }
                break;
            }

            /*------ HEADER y SPACER se mantienen ------*/
            case VIEW_TYPE_HEADER:
            case VIEW_TYPE_SPACER:
                break;

            /*------ FOOTER ------*/
            case VIEW_TYPE_FOOTER: {
                FooterViewHolder fvh = (FooterViewHolder) holder;
                ImageView img = fvh.itemView.findViewById(android.R.id.icon);
                if (img == null && fvh.itemView instanceof ViewGroup) {
                    ViewGroup vg = (ViewGroup) fvh.itemView;
                    for (int i = 0; i < vg.getChildCount(); i++)
                        if (vg.getChildAt(i) instanceof ImageView) {
                            img = (ImageView) vg.getChildAt(i);
                            break;
                        }
                }
                if (img != null) {
                    if (!unlockedFooter)
                        setGrayScale(img);
                    else
                        clearGrayScale(img);
                }
                fvh.itemView.setAlpha(unlockedFooter ? 1f : 0.5f);

                /* Zig-zag columna */
                int idx = 0;
                for (int i = position - 1; i >= 0; i--) {
                    if (items.get(i).getType() == CombinedItem.Type.FOOTER)
                        break;
                    if (items.get(i).getType() == CombinedItem.Type.COURSE)
                        idx++;
                }
                boolean rightCol = (idx % 2 != 0);
                holder.itemView.setTranslationX(rightCol ? -30 : -50);
                holder.itemView.setTranslationY(rightCol ? -45 : -50);
                break;
            }
        }

        /*------------- 4. Alpha general -------------------------*/
        boolean unlockedGeneral = (type == VIEW_TYPE_ACTIVITY) ? unlockedActivity
                : (type == VIEW_TYPE_COURSE) ? unlockedCourse
                        : (type == VIEW_TYPE_FOOTER) ? unlockedFooter
                                : true;
        holder.itemView.setAlpha(unlockedGeneral ? 1f : 0.5f);
        holder.itemView.setClickable(unlockedGeneral);
        holder.itemView.setFocusable(unlockedGeneral);
    }

    /*-------------------------------------------------
     * Helper: desplazar lo justo para “pegar” al borde
     *-------------------------------------------------*/
    private void pegadoDerecha(View item) {
        // Ejecutamos tras el layout para conocer el ancho real
        item.post(() -> {
            int columna = recycler.getWidth() / 2; // ancho de cada columna
            int shift = columna - item.getWidth(); // hueco que sobra
            item.setTranslationX(50);
        });
    }

    public static class CourseViewHolder extends RecyclerView.ViewHolder {
        TextView title;
        TextView description;
        ImageView background;
        LinearLayout coursecontainer;
        TextView itemNumber; // NUEVO

        public CourseViewHolder(View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.combined_course_title);
            description = itemView.findViewById(R.id.combined_course_description);
            background = itemView.findViewById(R.id.course_background);
            coursecontainer = itemView.findViewById(R.id.combined_course_container);
            itemNumber = itemView.findViewById(R.id.item_number); // NUEVO
            // Nuevo ID del ImageView
        }
    }

    public static class FooterViewHolder extends RecyclerView.ViewHolder {
        public FooterViewHolder(View itemView) {
            super(itemView);
        }
    }

    public class CombinedActivityViewHolder extends RecyclerView.ViewHolder {
        TextView itemName;
        RelativeLayout rightContainer; // Nuevo ID del FrameLayout

        TextView statusText;

        public CombinedActivityViewHolder(View itemView) {
            super(itemView);
            itemName = itemView.findViewById(R.id.combined_item_name);
            rightContainer = itemView.findViewById(R.id.right_container);

            statusText = itemView.findViewById(R.id.combined_statusText);
        }

        public void bind(TocItem item) {
            itemName.setText(item.name);

            switch (item.state) {
                case "completed":
                case "passed":

                    statusText.setText("Completado");
                    break;
                case "incomplete":

                    statusText.setText("En curso");
                    break;
                case "failed":

                    statusText.setText("Fallido");
                    break;
                default:

                    statusText.setText("No iniciado");
                    break;
            }
        }
    }

    public static class HeaderViewHolder extends RecyclerView.ViewHolder {
        public HeaderViewHolder(View itemView) {
            super(itemView);
            // Aquí podrías hacer findViewById si luego quieres manejar clics, textos, etc.
        }
    }

    // --- NUEVO: Métodos para escala de grises ---
    private void setGrayScale(ImageView imageView) {
        if (imageView == null)
            return;
        ColorMatrix matrix = new ColorMatrix();
        matrix.setSaturation(0);
        imageView.setColorFilter(new ColorMatrixColorFilter(matrix));
    }

    private void clearGrayScale(ImageView imageView) {
        if (imageView == null)
            return;
        imageView.setColorFilter(null);
    }

    /*-----------------------------------------------------------*
    *  Devuelve true si NO existe actividad previa o esa
    *  última actividad previa está completed / passed
    *-----------------------------------------------------------*/
    private boolean unlockedAfterPrevActivity(int pos) {
        for (int i = pos - 1; i >= 0; i--) {
            if (items.get(i).getType() == CombinedItem.Type.ACTIVITY) {
                TocItem prev = items.get(i).getActivity();
                return "completed".equals(prev.state) || "passed".equals(prev.state);
            }
        }
        return true; // no hay actividad previa → es el primer paso
    }

    /**
     * Aplica filtro de escala de grises a UN View, su fondo
     * y recursivamente a todos sus hijos.
     */
    private void setGrayScaleAll(View v) {
        // 1) Imagenes internas
        if (v instanceof ImageView) {
            setGrayScale((ImageView) v);
        }
        // 2) Drawable de fondo (shape, CardView, etc)
        if (v.getBackground() != null) {
            ColorMatrix cm = new ColorMatrix();
            cm.setSaturation(0);
            v.getBackground().setColorFilter(
                    new ColorMatrixColorFilter(cm));
        }
        // 3) Hijos
        if (v instanceof ViewGroup) {
            ViewGroup vg = (ViewGroup) v;
            for (int i = 0; i < vg.getChildCount(); i++) {
                setGrayScaleAll(vg.getChildAt(i));
            }
        }
    }

    private void clearGrayScaleAll(View v) {
        if (v instanceof ImageView) {
            clearGrayScale((ImageView) v);
        }
        if (v.getBackground() != null) {
            v.getBackground().clearColorFilter();
        }
        if (v instanceof ViewGroup) {
            ViewGroup vg = (ViewGroup) v;
            for (int i = 0; i < vg.getChildCount(); i++) {
                clearGrayScaleAll(vg.getChildAt(i));
            }
        }
    }

    /**
     * Devuelve true si el <COURSE> situado en coursePos debe mostrarse
     * a color (la actividad asociada –anterior o siguiente en la fila–
     * está desbloqueada).
     */
    private boolean isCourseTileUnlocked(int coursePos) {
        boolean assocUnlocked = false;

        // ¿actividad inmediatamente arriba?
        if (coursePos > 0 &&
                items.get(coursePos - 1).getType() == CombinedItem.Type.ACTIVITY) {
            assocUnlocked = unlockedAfterPrevActivity(coursePos - 1);
        }

        // ¿actividad inmediatamente abajo?
        if (!assocUnlocked &&
                coursePos + 1 < items.size() &&
                items.get(coursePos + 1).getType() == CombinedItem.Type.ACTIVITY) {
            assocUnlocked = unlockedAfterPrevActivity(coursePos + 1);
        }
        return assocUnlocked;
    }

    /**
     * Devuelve true si el FOOTER situado en footerPos debe mostrarse
     * a color (todas las actividades del curso están completed / passed).
     */
    private boolean isFooterUnlocked(int footerPos) {
        int coursePos = -1;

        // localizar el COURSE asociado (el último COURSE antes del footer)
        for (int i = footerPos - 1; i >= 0; i--) {
            if (items.get(i).getType() == CombinedItem.Type.COURSE) {
                coursePos = i;
                break;
            }
        }
        if (coursePos == -1)
            return true; // seguridad

        int act = 0, done = 0;
        for (int i = coursePos + 1; i < footerPos; i++) {
            if (items.get(i).getType() == CombinedItem.Type.ACTIVITY) {
                act++;
                TocItem t = items.get(i).getActivity();
                if ("completed".equals(t.state) || "passed".equals(t.state))
                    done++;
            }
        }
        return (act == 0) || (done == act);
    }

}