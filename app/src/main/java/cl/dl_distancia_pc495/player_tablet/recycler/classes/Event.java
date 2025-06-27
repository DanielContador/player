package cl.dl_distancia_a481.player_tablet.recycler.classes;

import java.util.ArrayList;

import cl.dl_distancia_a481.player_tablet.utils.SenceOtec;

/**
 * Created by Developer Android on 05-07-2016.
 */
public class Event {

    String title;
    String description;
    String ImagenName;
    SenceOtec SO;
    int id;
    String init_date;
    String fini_date;
    int situacion;
    int estado_nomina;
    ArrayList<Content> contents;


    public ArrayList<Content> getContents() {
        return contents;
    }

    public void setContents(ArrayList<Content> contents) {
        this.contents = contents;
    }

    public Event(int id, String title, String description, String Imagen, SenceOtec so, String i_date, String f_date, int situacion, int estado_nomina) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ImagenName = Imagen;
        this.SO = new SenceOtec(so.getCodigoSence(), so.getRutOtec(),so.getClaveOtec());
        this.init_date = i_date;
        this.fini_date = f_date;
        this.situacion = situacion;
        this.estado_nomina = estado_nomina;
    }

    public Event(int id, String title, String description, String Imagen, SenceOtec so, String i_date, String f_date, int situacion, int estado_nomina, ArrayList<Content> contents) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.ImagenName = Imagen;
        this.SO = new SenceOtec(so.getCodigoSence(), so.getRutOtec(),so.getClaveOtec());
        this.init_date = i_date;
        this.fini_date = f_date;
        this.situacion = situacion;
        this.estado_nomina = estado_nomina;
        this.contents = contents;
    }

    public int getid() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getImagenName() {
        return ImagenName;
    }

    public SenceOtec getSenceOtec() {
        return SO;
    }

    public String getInit_date() {
        return init_date;
    }

    public String getFini_date() {
        return fini_date;
    }

    public int getSituacion() {
        return situacion;
    }

    public int getEstado_nomina() {
        return estado_nomina;
    }
}
