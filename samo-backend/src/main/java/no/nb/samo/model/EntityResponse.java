package no.nb.samo.model;

public class EntityResponse {
    SamoDisplayEntity optidevEntity;
    String errorMessage;

    public EntityResponse(SamoDisplayEntity optidevEntity, String errorMessage) {
        this.optidevEntity = optidevEntity;
        this.errorMessage = errorMessage;
    }

    public SamoDisplayEntity getOptidevEntity() {
        return optidevEntity;
    }

    public void setOptidevEntity(SamoDisplayEntity optidevEntity) {
        this.optidevEntity = optidevEntity;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
