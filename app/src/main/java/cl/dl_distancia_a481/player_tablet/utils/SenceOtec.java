package cl.dl_distancia_a481.player_tablet.utils;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by Developer Android on 09-08-2016.
 */
public class SenceOtec implements Parcelable{

    String CodigoSence, RutOtec, ClaveOtec;

    public SenceOtec(String cs, String ro, String co) {

        this.CodigoSence = cs;
        this.RutOtec = ro;
        this.ClaveOtec = co;
    }

    public String getCodigoSence() {
        return CodigoSence;
    }

    public String getRutOtec() {
        return RutOtec;
    }

    public String getClaveOtec() {
        return ClaveOtec;
    }

    public SenceOtec(Parcel in) {
        CodigoSence = in.readString();
        RutOtec = in.readString();
        ClaveOtec = in.readString();
    }

    public static final Creator<SenceOtec> CREATOR = new Creator<SenceOtec>() {
        @Override
        public SenceOtec createFromParcel(Parcel in) {
            return new SenceOtec(in);
        }

        @Override
        public SenceOtec[] newArray(int size) {
            return new SenceOtec[size];
        }
    };
    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(CodigoSence);
        dest.writeString(RutOtec);
        dest.writeString(ClaveOtec);
    }
}