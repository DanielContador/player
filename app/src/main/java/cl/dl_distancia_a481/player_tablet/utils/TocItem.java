package cl.dl_distancia_a481.player_tablet.utils;

/**
 * Created by Developer Android on 02-02-2017.
 */

public class TocItem{

    public String name;
    public String identifier;
    public String identifierref;
    public String parentidentifier;
    public boolean parent;
    public int depth;
    public String state;

    public TocItem() {
        this.name = "";
        this.identifier = "";
        this.identifierref = "";
        this.parentidentifier = "";
        this.parent = false;
        this.depth = 0;
        this.state = "";
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public void setIdentifierref(String identifierref) {
        this.identifierref = identifierref;
    }

    public void setParentidentifier(String parentidentifier) {
        this.parentidentifier = parentidentifier;
    }

    public void setParent(boolean parent) {
        this.parent = parent;
    }

    public void setDepth(int depth) {
        this.depth = depth;
    }
}
