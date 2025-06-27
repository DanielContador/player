package cl.dl_distancia_a481.player_tablet.utils;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by Developer Android on 05-0

/**
 * Created by Developer Android on 05-07-2016.
 */
public class Persona implements Parcelable {
    private String Nombre;
    private String IdPersona;
    private String Rut;

    public Persona(Parcel in) {
        Nombre = in.readString();
        IdPersona = in.readString();
        Rut = in.readString();
    }

    public static final Creator<Persona> CREATOR = new Creator<Persona>() {
        @Override
        public Persona createFromParcel(Parcel in) {
            return new Persona(in);
        }

        @Override
        public Persona[] newArray(int size) {
            return new Persona[size];
        }
    };
    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(Nombre);
        dest.writeString(IdPersona);
        dest.writeString(Rut);
    }
    public Persona() {

    }

    public String getNombre() {
        return Nombre;
    }

    public void setNombre(String nombre) {
        Nombre = nombre;
    }

    public String getIdPersona() {
        return IdPersona;
    }

    public void setIdPersona(String idPersona) {
        IdPersona = idPersona;
    }

    public String getRut() {
        return Rut;
    }

    public void setRut(String rut) {
        Rut = rut;
    }


}

