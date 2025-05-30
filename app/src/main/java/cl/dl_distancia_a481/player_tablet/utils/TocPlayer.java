package cl.dl_distancia_a481.player_tablet.utils;

import java.util.ArrayList;

/**
 * Created by Developer Android on 02-02-2017.
 */

public class TocPlayer {
    private String organization;
    private ArrayList<TocItem> items;

    public TocPlayer() {
        this.organization = "";
        this.items = new ArrayList<>();
    }


    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getOrganization() {
        return organization;
    }

    public ArrayList<TocItem> getItems() {
        return items;
    }
}
