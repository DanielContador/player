package cl.dl_distancia_a481.player_tablet.recycler.classes;

/**
 * Created by Developer Android on 07-07-2016.
 */
public class Content {

    String nombre;
    String description;
    String Path;
    String codigosence;
    int id;
    int id_evento;
    int id_curso;
    boolean puede;
    int evalua;
    int intentos;
    int max_intentos;
    int puntaje;
    int estado;
    int situacion;

    public Content(int id, int id_evento, String nombre, String description, String Path,
                   int id_curso, String codigosence, boolean puede, int evalua, int intentos, int max_intentos, int puntaje, int estado, int situacion) {
        this.id = id;
        this.nombre = nombre;
        this.description = description;
        this.id_evento = id_evento;
        this.Path = Path;
        this.id_curso = id_curso;
        this.codigosence = codigosence;
        this.puede = puede;
        this.evalua = evalua;
        this.intentos = intentos;
        this.max_intentos = max_intentos;
        this.puntaje = puntaje;
        this.estado = estado;
        this.situacion = situacion;
    }

    public int getid() {
        return id;
    }

    public int getId_curso() {
        return id_curso;
    }

    public int getId_evento() {
        return id_evento;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescription() {
        return description;
    }

    public String getPath() {
        return Path;
    }

    public String getCodigoSence() {
        return codigosence;}

    public boolean getPuede() {
        return puede;
    }

    public int getEvalua() {
        return evalua;
    }

    public int getIntentos() {
        return intentos;
    }

    public int getMax_intentos() {
        return max_intentos;
    }

    public int getPuntaje(){
        return puntaje;
    }

    public int getEstado(){
        return estado;
    }

    public int getSituacion(){
        return situacion;
    }
}