package cl.dl_distancia_a481.player_tablet.utils;

/**
 * Created by Developer Android on 21-07-2016.
 */
public class String_Utils {

    public int GetOccurrences(String str, String findStr){
        int lastIndex = 0;
        int count = 0;

        while(lastIndex != -1){

            lastIndex = str.indexOf(findStr,lastIndex);

            if(lastIndex != -1){
                count ++;
                lastIndex += findStr.length();
            }
        }
        return count;
    }
}
