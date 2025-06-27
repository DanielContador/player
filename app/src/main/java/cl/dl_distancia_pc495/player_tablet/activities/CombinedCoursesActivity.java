package cl.dl_distancia_a481.player_tablet.activities;

import org.json.JSONException;

import android.content.Context;
import android.database.Cursor;
import android.os.Bundle;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.TextView;

import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import org.json.JSONObject;

import cl.dl_distancia_a481.player_tablet.utils.CombinedItem;
import cl.dl_distancia_a481.player_tablet.utils.XmlParse;
import cl.dl_distancia_a481.player_tablet.utils.TocPlayer;
import cl.dl_distancia_a481.player_tablet.utils.Scorm;
import cl.dl_distancia_a481.player_tablet.utils.TocItem;

import androidx.annotation.Nullable;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;

import cl.dl_distancia_a481.player_tablet.R;
import cl.dl_distancia_a481.player_tablet.recycler.adapters.CombinedCoursesAdapter;
import cl.dl_distancia_a481.player_tablet.recycler.classes.Content;
import cl.dl_distancia_a481.player_tablet.recycler.classes.Event;
import cl.dl_distancia_a481.player_tablet.utils.DbHelper;
import cl.dl_distancia_a481.player_tablet.utils.SenceOtec;

public class CombinedCoursesActivity extends BaseActivity {

    private RecyclerView recyclerView;
    private List<CombinedItem> combinedItems = new ArrayList<>();

    private DbHelper dbHelper;
    private ArrayList<Content> allContents = new ArrayList<>();
    private Context context;
    private CombinedCoursesAdapter adapter;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FrameLayout contentFrameLayout = findViewById(R.id.content_frame);
        getLayoutInflater().inflate(R.layout.activity_combined_courses, contentFrameLayout);

        context = this;
        dbHelper = DbHelper.getHelper(this);

        recyclerView = findViewById(R.id.recyclerEvents);

        // GridLayoutManager con 2 columnas
        GridLayoutManager layoutManager = new GridLayoutManager(this, 2);

        // SpanSizeLookup personalizado para controlar el ancho de cada tipo de ítem
        layoutManager.setSpanSizeLookup(new GridLayoutManager.SpanSizeLookup() {
            @Override
            public int getSpanSize(int position) {
                switch (combinedItems.get(position).getType()) {
                    case HEADER:
                        return 2; // ocupa las 2 columnas
                    case COURSE:
                    case FOOTER:
                    case ACTIVITY:
                    case SPACER:
                    default:
                        return 1; // ocupa 1 columna
                }
            }
        });

        recyclerView.setLayoutManager(layoutManager);

        loadAllData();
    }

    /* ② ─────────── REFRESCO AUTOMÁTICO AL VOLVER ─────────── */
    @Override
    protected void onResume() {
        super.onResume();
        if (adapter != null) {
            adapter.notifyDataSetChanged(); // fuerza re-bind de todas las filas
        }
    }

    private void loadAllData() {
        /*-------------------------------------------------
         * 0) Preparar contenedores
         *-------------------------------------------------*/
        combinedItems.clear();

        List<CombinedItem> rawItems = new ArrayList<>();
        combinedItems.add(new CombinedItem());
        /*-------------------------------------------------
         * 1) Datos ficticios de prueba
         *-------------------------------------------------*/
        // Content fakeCourse1 = new Content(
        // 9991, 0, "Curso Ficticio 1", "Descripción 1", "fake_path",
        // 0, "0000", true, 1, 0, 0, 100, 1, 1);

        // TocItem act1 = new TocItem();
        // act1.name = "Act 1";
        // act1.state = "completed";
        // TocItem act2 = new TocItem();
        // act2.name = "Act 2";
        // act2.state = "completed";

        // for (TocItem a : new TocItem[] { act1, act2 }) {
        // rawItems.add(new CombinedItem(fakeCourse1)); // COURSE
        // rawItems.add(new CombinedItem(a)); // ACTIVITY
        // }
        // rawItems.add(new CombinedItem(CombinedItem.Type.FOOTER));

        // Content fakeCourse2 = new Content(
        // 9999, 5, "Curso Ficticio 2", "Descripción 2", "fake_path",
        // 0, "0000", true, 1, 0, 0, 100, 1, 1);

        // TocItem act11 = new TocItem();
        // act11.name = "Act 11";
        // act11.state = "completed";
        // TocItem act22 = new TocItem();
        // act22.name = "Act 22";
        // act22.state = "completed";
        // TocItem act33 = new TocItem();
        // act33.name = "Act 33";
        // act33.state = "completed";

        // for (TocItem a : new TocItem[] { act11, act22, act33 }) {
        // rawItems.add(new CombinedItem(fakeCourse2)); // COURSE
        // rawItems.add(new CombinedItem(a)); // ACTIVITY
        // }
        // rawItems.add(new CombinedItem(CombinedItem.Type.FOOTER));

        /*-------------------------------------------------
         * 2) Datos reales (sin cambios)
         *-------------------------------------------------*/
        Cursor cursor = dbHelper.GetEvents("0");
        if (cursor.moveToFirst()) {
            do {
                int eventId = cursor.getInt(0);
                if (!containEvent(eventId, "0"))
                    continue;

                Event event = createEventFromCursor(cursor);
                ArrayList<Content> contents = getContents(event);

                for (Content content : contents) {
                    TocPlayer toc = new XmlParse(this, content.getPath()).GetToc();
                    Scorm scorm = new Scorm(this);
                    String statusStr = scorm.getScorm("toc_data", "1",
                            String.valueOf(content.getid()));
                    JSONObject status = null;
                    try {
                        JSONObject json = new JSONObject(statusStr);
                        status = new JSONObject(json.getString("aryCompletionStatus"));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                    for (TocItem item : toc.getItems()) {

                        // ─── FILTRO: saltar parents ───
                        if (item.parent)
                            continue;

                        try {
                            if (status != null && status.has(item.identifier)) {
                                item.state = status.getString(item.identifier); // ← ahora dentro del try
                            }
                        } catch (JSONException e) {
                            e.printStackTrace(); // o tu manejo de error preferido
                        }

                        rawItems.add(new CombinedItem(content)); // COURSE
                        rawItems.add(new CombinedItem(item)); // ACTIVITY
                    }

                    rawItems.add(new CombinedItem(CombinedItem.Type.FOOTER));
                }
            } while (cursor.moveToNext());
        }

        /*-------------------------------------------------
         * 3) Insertar FOOTER justo bajo la última ACTIVITY
         *-------------------------------------------------*/
        List<CombinedItem> tempItems = new ArrayList<>();
        int currentCol = 0; // 0 = col-1 libre, 1 = col-2 libre
        int lastActivityCol = -1; // columna donde quedó la última ACTIVITY

        for (CombinedItem it : rawItems) {

            if (it.getType() != CombinedItem.Type.FOOTER) {
                tempItems.add(it);

                if (it.getType() == CombinedItem.Type.ACTIVITY)
                    lastActivityCol = currentCol;

                currentCol = (currentCol + 1) % 2;
                continue;
            }

            /* -- FOOTER -- */
            int targetCol = (lastActivityCol == -1) ? 0 : lastActivityCol;

            while (currentCol != targetCol) { // spacer hasta la col deseada
                tempItems.add(new CombinedItem(CombinedItem.Type.SPACER));
                currentCol = (currentCol + 1) % 2;
            }

            tempItems.add(it); // footer
            currentCol = (currentCol + 1) % 2;

            if (currentCol != 0) { // cerrar fila si falta una celda
                tempItems.add(new CombinedItem(CombinedItem.Type.SPACER));
                currentCol = 0;
            }

            lastActivityCol = -1; // reiniciar para la sección sig.
        }

        /*-------------------------------------------------
         * 4) Aplicar zig-zag dentro de cada sección
         *-------------------------------------------------*/
        List<CombinedItem> finalItems = new ArrayList<>();
        int idx = 0, rowInSection = 0;

        while (idx < tempItems.size()) {
            CombinedItem first = tempItems.get(idx);
            CombinedItem second = (idx + 1 < tempItems.size()) ? tempItems.get(idx + 1) : null;

            boolean hasFooter = first.getType() == CombinedItem.Type.FOOTER ||
                    (second != null && second.getType() == CombinedItem.Type.FOOTER);

            if (!hasFooter) {
                boolean swap = (rowInSection % 2 == 1) && second != null
                        && second.getType() != CombinedItem.Type.SPACER;
                if (swap) {
                    finalItems.add(second);
                    finalItems.add(first);
                } else {
                    finalItems.add(first);
                    if (second != null)
                        finalItems.add(second);
                }
                rowInSection++;
            } else {
                finalItems.add(first);
                if (second != null)
                    finalItems.add(second);
                rowInSection = 0;
            }
            idx += (second == null) ? 1 : 2;
        }

        /*-------------------------------------------------
         * 4.5) Ajustar FOOTER tras el zig-zag
         *-------------------------------------------------*/
        for (int j = 0; j < finalItems.size();) {

            // localizar próximo footer
            int footerIdx = -1;
            for (; j < finalItems.size(); j++) {
                if (finalItems.get(j).getType() == CombinedItem.Type.FOOTER) {
                    footerIdx = j;
                    break;
                }
            }
            if (footerIdx == -1)
                break;

            // localizar última actividad antes de ese footer
            int lastActIdx = -1;
            for (int k = footerIdx - 1; k >= 0; k--) {
                CombinedItem.Type t = finalItems.get(k).getType();
                if (t == CombinedItem.Type.ACTIVITY) {
                    lastActIdx = k;
                    break;
                } else if (t == CombinedItem.Type.FOOTER)
                    break; // otra sección
            }
            if (lastActIdx == -1) {
                j = footerIdx + 1;
                continue;
            }

            int footerCol = footerIdx % 2;
            int actCol = lastActIdx % 2;

            if (footerCol != actCol) {
                if (footerCol == 0 && footerIdx + 1 < finalItems.size() &&
                        finalItems.get(footerIdx + 1).getType() == CombinedItem.Type.SPACER) {
                    Collections.swap(finalItems, footerIdx, footerIdx + 1); // mover a la derecha
                } else if (footerCol == 1 && footerIdx - 1 >= 0 &&
                        finalItems.get(footerIdx - 1).getType() == CombinedItem.Type.SPACER) {
                    Collections.swap(finalItems, footerIdx, footerIdx - 1); // mover a la izq.
                }
            }
            j = footerIdx + 1; // continuar después de este footer
        }

        /*-------------------------------------------------
         * 5) Enlazar al RecyclerView
         *-------------------------------------------------*/
        combinedItems.addAll(finalItems);
        adapter = new CombinedCoursesAdapter(this, combinedItems, recyclerView);
        recyclerView.setAdapter(adapter);

        toggleEmptyView(combinedItems.isEmpty());
    }

    private void toggleEmptyView(boolean isEmpty) {
        if (isEmpty) {
            recyclerView.setVisibility(View.GONE);
            findViewById(R.id.empty_events).setVisibility(View.VISIBLE);
        } else {
            recyclerView.setVisibility(View.VISIBLE);
            findViewById(R.id.empty_events).setVisibility(View.GONE);
        }
    }

    private ArrayList<TocItem> loadAllTocItemsFromAllEvents() {
        ArrayList<TocItem> allTocItems = new ArrayList<>();

        try {
            Cursor cursor = dbHelper.GetEvents("0");
            if (cursor.moveToFirst()) {
                do {
                    int eventId = cursor.getInt(0);

                    // Validar si contiene contenido válido en assets
                    if (!containEvent(eventId, "0"))
                        continue;

                    Event event = createEventFromCursor(cursor);
                    ArrayList<Content> contents = getContents(event);

                    for (Content content : contents) {
                        // Parsear TOC
                        XmlParse parser = new XmlParse(this, content.getPath());
                        TocPlayer toc = parser.GetToc();

                        // Obtener estado del SCORM
                        Scorm scorm = new Scorm(this);
                        String statusStr = scorm.getScorm("toc_data", "1", String.valueOf(content.getid()));

                        JSONObject json = new JSONObject(statusStr);
                        JSONObject status = new JSONObject(json.getString("aryCompletionStatus"));

                        for (TocItem item : toc.getItems()) {
                            if (status.has(item.identifier)) {
                                item.state = status.getString(item.identifier);
                            }
                            allTocItems.add(item);
                        }
                    }

                } while (cursor.moveToNext());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return allTocItems;
    }

    private Event createEventFromCursor(Cursor cursor) {
        int id = cursor.getInt(0);
        String name = cursor.getString(1);
        String descripcion = cursor.getString(2);
        String imagenName = cursor.getString(3);
        String codigoSence = cursor.getString(4);
        String rutOtect = cursor.getString(5);
        String claveOtec = cursor.getString(6);
        String fechaInicio = cursor.getString(7).split("T")[0];
        String fechaTermino = cursor.getString(8).split("T")[0];
        int situacion_final = cursor.getInt(9);
        int estado_nomina = cursor.getInt(10);

        SenceOtec so = new SenceOtec(codigoSence, rutOtect, claveOtec);
        return new Event(id, name, descripcion, imagenName, so, fechaInicio, fechaTermino, situacion_final,
                estado_nomina);
    }

    private ArrayList<Content> getContents(Event event) {
        ArrayList<Content> contents = new ArrayList<>();
        Cursor cursor = dbHelper.GetContents(event.getid(), "0");

        if (cursor.moveToFirst()) {
            do {
                int id = cursor.getInt(0);
                String name = cursor.getString(1);
                String descripcion = cursor.getString(2);
                String path = cursor.getString(3);
                int id_curso = cursor.getInt(4);
                int intentos = cursor.getInt(5);
                int maxintentos = cursor.getInt(6);
                int evalua = cursor.getInt(7);
                int puntaje = cursor.getInt(8);
                int estado_contenido = cursor.getInt(9);
                int situacion_final = cursor.getInt(10);

                boolean puede = maxintentos == 0 || intentos < maxintentos;

                contents.add(new Content(id, event.getid(), name, descripcion, path, id_curso,
                        event.getSenceOtec().getCodigoSence(), puede, evalua, intentos, maxintentos,
                        puntaje, estado_contenido, situacion_final));

            } while (cursor.moveToNext());
        }
        return contents;
    }

    private boolean containEvent(int IdEvento, String id_persona) {
        try {
            Cursor cursor = dbHelper.GetPathContents(IdEvento, id_persona);
            if (cursor.moveToFirst()) {
                String[] files = getAssets().list("www" + File.separator + "player" + File.separator + "courses");
                do {
                    String path = cursor.getString(0);
                    if (!Arrays.asList(files).contains(path)) {
                        return false;
                    }
                } while (cursor.moveToNext());
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

}
