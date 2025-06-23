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

    @Override
    public void onBindViewHolder(@androidx.annotation.NonNull RecyclerView.ViewHolder holder,
            int position) {

        CombinedItem ci = items.get(position);
        int viewType = getItemViewType(position);

        /*-------------------------------------------------
         * 1. Altura fija (excepto SPACER)
         *-------------------------------------------------*/
        if (viewType != VIEW_TYPE_SPACER) {
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

        // --- NUEVO: Lógica de desbloqueo secuencial y bloqueo visual ---
        boolean isUnlocked = true;
        boolean isCourseUnlocked = true;
        boolean isFooterUnlocked = true;
        int courseIdx = -1;
        Content currentCourse = null;

        if (viewType == VIEW_TYPE_ACTIVITY || viewType == VIEW_TYPE_FOOTER || viewType == VIEW_TYPE_COURSE) {
            // Buscar el curso asociado
            for (int i = position - 1; i >= 0; i--) {
                if (items.get(i).getType() == CombinedItem.Type.COURSE) {
                    currentCourse = items.get(i).getCourse();
                    courseIdx = i;
                    break;
                }
            }
        }

        // --- Lógica de actividades desbloqueadas (ya implementada) ---
        if (viewType == VIEW_TYPE_ACTIVITY) {
            // Buscar el índice de la actividad dentro de su curso
            int idxInCourse = 0;
            if (currentCourse != null) {
                for (int i = courseIdx + 1, idx = 0; i < items.size(); i++) {
                    if (items.get(i).getType() == CombinedItem.Type.COURSE
                            || items.get(i).getType() == CombinedItem.Type.FOOTER)
                        break;
                    if (items.get(i).getType() == CombinedItem.Type.ACTIVITY) {
                        if (i == position)
                            idxInCourse = idx;
                        idx++;
                    }
                }
            }
            if (idxInCourse == 0) {
                isUnlocked = true;
            } else {
                for (int i = position - 1; i > courseIdx; i--) {
                    if (items.get(i).getType() == CombinedItem.Type.ACTIVITY) {
                        TocItem prevAct = items.get(i).getActivity();
                        if ("completed".equals(prevAct.state) || "passed".equals(prevAct.state)) {
                            isUnlocked = true;
                        } else {
                            isUnlocked = false;
                        }
                        break;
                    }
                }
            }
            // Lógica de bloqueo de cursos siguientes si el curso actual tiene solo 1
            // actividad
            int actCount = 0;
            for (int i = courseIdx + 1; i < items.size(); i++) {
                if (items.get(i).getType() == CombinedItem.Type.COURSE
                        || items.get(i).getType() == CombinedItem.Type.FOOTER)
                    break;
                if (items.get(i).getType() == CombinedItem.Type.ACTIVITY)
                    actCount++;
            }
            if (actCount == 1) {
                if (idxInCourse == 0 && courseIdx > 0) {
                    int prevCourseIdx = -1;
                    for (int i = courseIdx - 1; i >= 0; i--) {
                        if (items.get(i).getType() == CombinedItem.Type.COURSE) {
                            prevCourseIdx = i;
                            break;
                        }
                    }
                    if (prevCourseIdx >= 0) {
                        for (int i = prevCourseIdx + 1, lastActIdx = -1; i < items.size(); i++) {
                            if (items.get(i).getType() == CombinedItem.Type.COURSE
                                    || items.get(i).getType() == CombinedItem.Type.FOOTER)
                                break;
                            if (items.get(i).getType() == CombinedItem.Type.ACTIVITY)
                                lastActIdx = i;
                            if (lastActIdx != -1
                                    && (i + 1 == items.size() || items.get(i + 1).getType() == CombinedItem.Type.COURSE
                                            || items.get(i + 1).getType() == CombinedItem.Type.FOOTER)) {
                                TocItem lastAct = items.get(lastActIdx).getActivity();
                                if (!("completed".equals(lastAct.state) || "passed".equals(lastAct.state))) {
                                    isUnlocked = false;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

        // --- Lógica de COURSE: color depende del estado de la actividad siguiente ---
        if (viewType == VIEW_TYPE_COURSE) {
            // Por defecto, el COURSE está bloqueado
            isCourseUnlocked = false;
            // Si la siguiente actividad está desbloqueada, el COURSE debe estar a color
            if (position + 1 < items.size() && items.get(position + 1).getType() == CombinedItem.Type.ACTIVITY) {
                // Simular la lógica de desbloqueo para la actividad siguiente
                boolean nextActivityUnlocked = true;
                int nextActIdxInCourse = 0;
                int nextCourseIdx = position;
                Content nextCourse = ci.getCourse();
                // Buscar idxInCourse de la actividad siguiente
                for (int i = nextCourseIdx + 1, idx = 0; i < items.size(); i++) {
                    if (items.get(i).getType() == CombinedItem.Type.COURSE
                            || items.get(i).getType() == CombinedItem.Type.FOOTER)
                        break;
                    if (items.get(i).getType() == CombinedItem.Type.ACTIVITY) {
                        if (i == position + 1)
                            nextActIdxInCourse = idx;
                        idx++;
                    }
                }
                if (nextActIdxInCourse == 0) {
                    nextActivityUnlocked = true;
                } else {
                    // Buscar la actividad anterior a la siguiente
                    for (int i = position; i > nextCourseIdx; i--) {
                        if (items.get(i).getType() == CombinedItem.Type.ACTIVITY) {
                            TocItem prevAct = items.get(i).getActivity();
                            if ("completed".equals(prevAct.state) || "passed".equals(prevAct.state)) {
                                nextActivityUnlocked = true;
                            } else {
                                nextActivityUnlocked = false;
                            }
                            break;
                        }
                    }
                }
                // Lógica de bloqueo de cursos siguientes si el curso actual tiene solo 1
                // actividad
                int actCount = 0;
                for (int i = nextCourseIdx + 1; i < items.size(); i++) {
                    if (items.get(i).getType() == CombinedItem.Type.COURSE
                            || items.get(i).getType() == CombinedItem.Type.FOOTER)
                        break;
                    if (items.get(i).getType() == CombinedItem.Type.ACTIVITY)
                        actCount++;
                }
                if (actCount == 1) {
                    if (nextActIdxInCourse == 0 && nextCourseIdx > 0) {
                        int prevCourseIdx = -1;
                        for (int i = nextCourseIdx - 1; i >= 0; i--) {
                            if (items.get(i).getType() == CombinedItem.Type.COURSE) {
                                prevCourseIdx = i;
                                break;
                            }
                        }
                        if (prevCourseIdx >= 0) {
                            for (int i = prevCourseIdx + 1, lastActIdx = -1; i < items.size(); i++) {
                                if (items.get(i).getType() == CombinedItem.Type.COURSE
                                        || items.get(i).getType() == CombinedItem.Type.FOOTER)
                                    break;
                                if (items.get(i).getType() == CombinedItem.Type.ACTIVITY)
                                    lastActIdx = i;
                                if (lastActIdx != -1 && (i + 1 == items.size()
                                        || items.get(i + 1).getType() == CombinedItem.Type.COURSE
                                        || items.get(i + 1).getType() == CombinedItem.Type.FOOTER)) {
                                    TocItem lastAct = items.get(lastActIdx).getActivity();
                                    if (!("completed".equals(lastAct.state) || "passed".equals(lastAct.state))) {
                                        nextActivityUnlocked = false;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
                isCourseUnlocked = nextActivityUnlocked;
            }
        }

        // --- Lógica de footer desbloqueado: solo si TODAS las actividades del curso
        // están completadas ---
        if (viewType == VIEW_TYPE_FOOTER) {
            isFooterUnlocked = true;
            int actCount = 0, completedCount = 0;
            // Buscar el curso asociado
            if (currentCourse != null && courseIdx >= 0) {
                for (int i = courseIdx + 1; i < position; i++) {
                    if (items.get(i).getType() == CombinedItem.Type.ACTIVITY) {
                        actCount++;
                        TocItem act = items.get(i).getActivity();
                        if ("completed".equals(act.state) || "passed".equals(act.state)) {
                            completedCount++;
                        }
                    }
                }
                if (actCount > 0 && completedCount < actCount) {
                    isFooterUnlocked = false;
                }
            }
        }

        switch (viewType) {

            case VIEW_TYPE_COURSE: {
                CourseViewHolder vh = (CourseViewHolder) holder;
                vh.title.setText(ci.getCourse().getNombre());
                vh.description.setText(ci.getCourse().getDescription());

                // Determinar posición relativa en sección (para columnas visuales)
                int idxInSection = 0;
                for (int i = position - 1; i >= 0; i--) {
                    CombinedItem.Type t = items.get(i).getType();
                    if (t == CombinedItem.Type.FOOTER)
                        break;
                    if (t == CombinedItem.Type.COURSE)
                        idxInSection++;
                }

                boolean izqVisual = (idxInSection % 2 == 0); // par = izquierda

                if (izqVisual) {
                    vh.background.setImageResource(R.drawable.bg_left);

                    // Alinea el ítem a la derecha del contenedor
                    pegadoDerecha(vh.itemView);

                    // Asegura que el coursecontainer no tenga traslación accidental
                    vh.coursecontainer.setTranslationX(0);
                    vh.coursecontainer.setTranslationY(-30);
                } else {
                    vh.background.setImageResource(R.drawable.bg_right);

                    // Alinea todo el ítem hacia la izquierda
                    vh.itemView.setTranslationX(-90);

                    // Solo aquí: mueve el contenedor hacia la derecha (más cerca del borde visual)
                    vh.coursecontainer.setTranslationX(340);
                    vh.coursecontainer.setTranslationY(-70);
                }

                // --- NUEVO: escala de grises si está bloqueado ---
                if (!isCourseUnlocked) {
                    setGrayScale(vh.background);
                    vh.itemView.setAlpha(0.5f);
                } else {
                    clearGrayScale(vh.background);
                    vh.itemView.setAlpha(1.0f);
                }
                break;
            }

            /*------------ ACTIVITY ----------*/
            case VIEW_TYPE_ACTIVITY: {
                CombinedActivityViewHolder avh = (CombinedActivityViewHolder) holder;
                avh.bind(ci.getActivity());

                int idxInSection = 0;
                for (int i = position - 1; i >= 0; i--) {
                    CombinedItem.Type t = items.get(i).getType();
                    if (t == CombinedItem.Type.FOOTER)
                        break;
                    if (t == CombinedItem.Type.ACTIVITY)
                        idxInSection++;
                }

                boolean izqVisual = (idxInSection % 2 == 0); // izquierda si par

                if (izqVisual) {
                    avh.rightContainer.setTranslationX(100); // mover hacia la derecha
                } else {
                    avh.rightContainer.setTranslationX(70); // o mover a la izquierda si quieres (-60)
                }

                // --- NUEVO: escala de grises si está bloqueado ---
                ImageView buttonRight = avh.itemView.findViewById(R.id.buttonright);
                if (!isUnlocked) {
                    if (buttonRight != null)
                        setGrayScale(buttonRight);
                    avh.itemView.setAlpha(0.5f);
                } else {
                    if (buttonRight != null)
                        clearGrayScale(buttonRight);
                    avh.itemView.setAlpha(1.0f);
                }

                // --- NUEVO: escala de grises para circulo si el siguiente curso o footer está
                // bloqueado ---
                ImageView circuloImage = avh.itemView.findViewById(R.id.circulo_image);
                if (circuloImage != null) {
                    boolean nextCourseBlocked = false;
                    boolean nextFooterBlocked = false;
                    // Buscar el siguiente COURSE y FOOTER después de esta actividad
                    for (int i = position + 1; i < items.size(); i++) {
                        if (items.get(i).getType() == CombinedItem.Type.COURSE) {
                            // Simular la lógica de desbloqueo para ese COURSE
                            boolean isNextCourseUnlocked = false;
                            if (i + 1 < items.size() && items.get(i + 1).getType() == CombinedItem.Type.ACTIVITY) {
                                boolean nextActivityUnlocked = true;
                                int nextActIdxInCourse = 0;
                                int nextCourseIdx = i;
                                for (int j = nextCourseIdx + 1, idx = 0; j < items.size(); j++) {
                                    if (items.get(j).getType() == CombinedItem.Type.COURSE
                                            || items.get(j).getType() == CombinedItem.Type.FOOTER)
                                        break;
                                    if (items.get(j).getType() == CombinedItem.Type.ACTIVITY) {
                                        if (j == i + 1)
                                            nextActIdxInCourse = idx;
                                        idx++;
                                    }
                                }
                                if (nextActIdxInCourse == 0) {
                                    nextActivityUnlocked = true;
                                } else {
                                    for (int j = i; j > nextCourseIdx; j--) {
                                        if (items.get(j).getType() == CombinedItem.Type.ACTIVITY) {
                                            TocItem prevAct = items.get(j).getActivity();
                                            if ("completed".equals(prevAct.state) || "passed".equals(prevAct.state)) {
                                                nextActivityUnlocked = true;
                                            } else {
                                                nextActivityUnlocked = false;
                                            }
                                            break;
                                        }
                                    }
                                }
                                int actCount = 0;
                                for (int j = nextCourseIdx + 1; j < items.size(); j++) {
                                    if (items.get(j).getType() == CombinedItem.Type.COURSE
                                            || items.get(j).getType() == CombinedItem.Type.FOOTER)
                                        break;
                                    if (items.get(j).getType() == CombinedItem.Type.ACTIVITY)
                                        actCount++;
                                }
                                if (actCount == 1) {
                                    if (nextActIdxInCourse == 0 && nextCourseIdx > 0) {
                                        int prevCourseIdx = -1;
                                        for (int j = nextCourseIdx - 1; j >= 0; j--) {
                                            if (items.get(j).getType() == CombinedItem.Type.COURSE) {
                                                prevCourseIdx = j;
                                                break;
                                            }
                                        }
                                        if (prevCourseIdx >= 0) {
                                            for (int j = prevCourseIdx + 1, lastActIdx = -1; j < items.size(); j++) {
                                                if (items.get(j).getType() == CombinedItem.Type.COURSE
                                                        || items.get(j).getType() == CombinedItem.Type.FOOTER)
                                                    break;
                                                if (items.get(j).getType() == CombinedItem.Type.ACTIVITY)
                                                    lastActIdx = j;
                                                if (lastActIdx != -1 && (j + 1 == items.size()
                                                        || items.get(j + 1).getType() == CombinedItem.Type.COURSE
                                                        || items.get(j + 1).getType() == CombinedItem.Type.FOOTER)) {
                                                    TocItem lastAct = items.get(lastActIdx).getActivity();
                                                    if (!("completed".equals(lastAct.state)
                                                            || "passed".equals(lastAct.state))) {
                                                        nextActivityUnlocked = false;
                                                    }
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                isNextCourseUnlocked = nextActivityUnlocked;
                            }
                            nextCourseBlocked = !isNextCourseUnlocked;
                            break;
                        }
                        if (items.get(i).getType() == CombinedItem.Type.FOOTER) {
                            // Simular la lógica de desbloqueo para ese FOOTER
                            isFooterUnlocked = true;
                            courseIdx = -1;
                            currentCourse = null;
                            // Buscar el curso asociado a este FOOTER
                            for (int k = i - 1; k >= 0; k--) {
                                if (items.get(k).getType() == CombinedItem.Type.COURSE) {
                                    currentCourse = items.get(k).getCourse();
                                    courseIdx = k;
                                    break;
                                }
                            }
                            int actCount = 0, completedCount = 0;
                            if (currentCourse != null && courseIdx >= 0) {
                                for (int k = courseIdx + 1; k < i; k++) {
                                    if (items.get(k).getType() == CombinedItem.Type.ACTIVITY) {
                                        actCount++;
                                        TocItem act = items.get(k).getActivity();
                                        if ("completed".equals(act.state) || "passed".equals(act.state)) {
                                            completedCount++;
                                        }
                                    }
                                }
                                if (actCount > 0 && completedCount < actCount) {
                                    isFooterUnlocked = false;
                                }
                            }
                            nextFooterBlocked = !isFooterUnlocked;
                            break;
                        }
                    }
                    if (nextCourseBlocked || nextFooterBlocked) {
                        setGrayScale(circuloImage);
                    } else {
                        clearGrayScale(circuloImage);
                    }
                }

                avh.itemView.setClickable(isUnlocked);
                avh.itemView.setFocusable(isUnlocked);

                if (isUnlocked) {
                    avh.itemView.setOnClickListener(v -> {
                        TocItem tocItem = ci.getActivity();
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
                        b.putString("identifier", tocItem.identifier);
                        b.putString("identifierref", tocItem.identifierref);

                        Intent i = new Intent(context, CursoActivity.class);
                        i.putExtras(b);
                        context.startActivity(i);
                    });
                } else {
                    avh.itemView.setOnClickListener(null);
                }
                break;
            }

            /*------------ HEADER ------------*/

            case VIEW_TYPE_HEADER:
                // Si necesitas actualizar imagen o texto dinámicamente, hazlo aquí
                break;

            /*------------ FOOTER ------------*/
            case VIEW_TYPE_FOOTER: {
                FooterViewHolder fvh = (FooterViewHolder) holder;
                ImageView footerImage = fvh.itemView.findViewById(android.R.id.icon);
                // Si el layout no tiene id, buscar el primer ImageView
                if (footerImage == null) {
                    if (fvh.itemView instanceof ViewGroup) {
                        ViewGroup vg = (ViewGroup) fvh.itemView;
                        for (int i = 0; i < vg.getChildCount(); i++) {
                            View v = vg.getChildAt(i);
                            if (v instanceof ImageView) {
                                footerImage = (ImageView) v;
                                break;
                            }
                        }
                    }
                }
                if (!isFooterUnlocked && footerImage != null) {
                    setGrayScale(footerImage);
                    fvh.itemView.setAlpha(0.5f);
                } else if (footerImage != null) {
                    clearGrayScale(footerImage);
                    fvh.itemView.setAlpha(1.0f);
                }

                // Determinar si el footer cae en la columna 2 (visual, zigzag)
                int idxInSection = 0;
                for (int i = position - 1; i >= 0; i--) {
                    CombinedItem.Type t = items.get(i).getType();
                    if (t == CombinedItem.Type.FOOTER)
                        break;
                    if (t == CombinedItem.Type.COURSE)
                        idxInSection++;
                }

                boolean isRightColumn = (idxInSection % 2 != 0); // columna visual derecha

                if (isRightColumn) {
                    holder.itemView.setTranslationX(-30); // pegado al borde izquierdo
                    holder.itemView.setTranslationY(-45); // pegado al borde izquierdo
                } else {
                    holder.itemView.setTranslationX(-50); // pegado al borde derecho
                    holder.itemView.setTranslationY(-50); // pegado al borde derecho
                }
                break;
            }

            /*------------ SPACER ------------*/
            case VIEW_TYPE_SPACER:
                break;
        }

        // --- NUEVO: Deshabilitar visualmente y funcionalmente si está bloqueado ---
        holder.itemView.setAlpha(isUnlocked ? 1.0f : 0.5f);
        holder.itemView.setClickable(isUnlocked);
        holder.itemView.setFocusable(isUnlocked);
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

        public CourseViewHolder(View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.combined_course_title);
            description = itemView.findViewById(R.id.combined_course_description);
            background = itemView.findViewById(R.id.course_background);
            coursecontainer = itemView.findViewById(R.id.combined_course_container);

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
}