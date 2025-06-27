package cl.dl_distancia_a481.player_tablet.utils;

import java.util.Date;

public class Licence {

    private int LicenceId;
    private String UserId;
    private int ClientId;
    private int CourseId;
    private int DeviceId;
    private int EventId;
    private String Code;
    private Date StartDate;
    private Date EndDate;
    private Date LastConectedDate;
    private boolean Status;
    private boolean isDelete;

    public int getLicenceId() {
        return LicenceId;
    }

    public void setLicenceId(int licenceId) {
        LicenceId = licenceId;
    }

    public String getUserId() {
        return UserId;
    }

    public void setUserId(String userId) {
        UserId = userId;
    }

    public int getClientId() {
        return ClientId;
    }

    public void setClientId(int clientId) {
        ClientId = clientId;
    }

    public int getCourseId() {
        return CourseId;
    }

    public void setCourseId(int courseId) {
        CourseId = courseId;
    }

    public int getDeviceId() {
        return DeviceId;
    }

    public void setDeviceId(int deviceId) {
        DeviceId = deviceId;
    }

    public int getEventId() {
        return EventId;
    }

    public void setEventId(int eventId) {
        EventId = eventId;
    }

    public String getCode() {
        return Code;
    }

    public void setCode(String code) {
        Code = code;
    }

    public Date getStartDate() {
        return StartDate;
    }

    public void setStartDate(Date startDate) {
        StartDate = startDate;
    }

    public Date getEndDate() {
        return EndDate;
    }

    public void setEndDate(Date endDate) {
        EndDate = endDate;
    }

    public Date getLastConectedDate() {
        return LastConectedDate;
    }

    public void setLastConectedDate(Date lastConectedDate) {
        LastConectedDate = lastConectedDate;
    }

    public boolean isStatus() {
        return Status;
    }

    public void setStatus(boolean status) {
        Status = status;
    }

    public boolean isDelete() {
        return isDelete;
    }

    public void setDelete(boolean delete) {
        isDelete = delete;
    }
}
