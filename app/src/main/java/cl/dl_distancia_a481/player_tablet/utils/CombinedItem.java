package cl.dl_distancia_a481.player_tablet.utils;

import cl.dl_distancia_a481.player_tablet.recycler.classes.Content;

public class CombinedItem {
    public enum Type {HEADER, COURSE, ACTIVITY, FOOTER,SPACER }
    private Type type;
    private Content course;
    private TocItem activity;

    public CombinedItem(Content c) {
        this.type = Type.COURSE;
        this.course = c;
    }
    public CombinedItem(TocItem t) {
        this.type = Type.ACTIVITY;
        this.activity = t;
    }

    // Constructor para FOOTER
    public CombinedItem(Type type) {
        this.type = type; // Se usará solo con Type.FOOTER
    }

    public CombinedItem() {
    this.type = Type.HEADER;
}




    public Type getType() { return type; }
    public Content getCourse() { return course; }
    public TocItem getActivity() { return activity; }
}
