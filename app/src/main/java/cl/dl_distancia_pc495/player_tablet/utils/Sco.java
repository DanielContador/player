package cl.dl_distancia_a481.player_tablet.utils;

/**
 * Created by andres on 08-07-16.
 */
public class Sco {
    private int Id ;
    private String Name ;
    private String TheData ;
    private int CourseId ;
    private int StudentId ;
    private String Modified ;
    private String ActivityId ;
    private ParsedScorm ParsedData ;
    private String version ;

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getTheData() {
        return TheData;
    }

    public void setTheData(String theData) {
        TheData = theData;
    }

    public int getCourseId() {
        return CourseId;
    }

    public void setCourseId(int courseId) {
        CourseId = courseId;
    }

    public int getStudentId() {
        return StudentId;
    }

    public void setStudentId(int studentId) {
        StudentId = studentId;
    }

    public String getModified() {
        return Modified;
    }

    public void setModified(String modified) {
        Modified = modified;
    }

    public String getActivityId() {
        return ActivityId;
    }

    public void setActivityId(String activityId) {
        ActivityId = activityId;
    }

    public ParsedScorm getParsedData() {
        return ParsedData;
    }

    public void setParsedData(ParsedScorm parsedData) {
        ParsedData = parsedData;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
