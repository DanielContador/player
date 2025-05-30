package cl.dl_distancia_a481.player_tablet.recycler.classes;

public class News {

    int id;
    String name;
    String text;
    String imageName;

    public News() {
    }

    public News(int id, String name, String text, String imageName) {
        this.id = id;
        this.name = name;
        this.text = text;
        this.imageName = imageName;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getText() {
        return text;
    }

    public String getImageName() {
        return imageName;
    }
}
