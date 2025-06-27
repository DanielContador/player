package cl.dl_distancia_a481.player_tablet.utils;


public class Client {


    private int clientId;
    private int clientRUT;
    private String clientName;
    private String clientAlias;
    private String clientEmail;
    private String licences;

    public String getLicences() {
        return licences;
    }

    public void setLicences(String licences) {
        this.licences = licences;
    }

    public int getClientId() {
        return clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
    }

    public int getClientRUT() {
        return clientRUT;
    }

    public void setClientRUT(int clientRUT) {
        this.clientRUT = clientRUT;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientAlias() {
        return clientAlias;
    }

    public void setClientAlias(String clientAlias) {
        this.clientAlias = clientAlias;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }


}
