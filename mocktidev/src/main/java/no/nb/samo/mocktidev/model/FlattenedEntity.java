package no.nb.samo.mocktidev.model;

public class FlattenedEntity {
    private Integer outerId;
    private String objectBarcode;
    private String boxBarcode;
    private String crateBarcode;
    private String palletBarcode;
    private String locationBarcode;
    private EntityType type;

    public FlattenedEntity() {
    }

    public FlattenedEntity(Integer outerId) {
        this.outerId = outerId;
    }

    public Integer getOuterId() {
        return outerId;
    }

    public void setOuterId(Integer outerId) {
        this.outerId = outerId;
    }

    public String getObjectBarcode() {
        return objectBarcode;
    }

    public void setObjectBarcode(String objectBarcode) {
        this.objectBarcode = objectBarcode;
    }

    public String getBoxBarcode() {
        return boxBarcode;
    }

    public void setBoxBarcode(String boxBarcode) {
        this.boxBarcode = boxBarcode;
    }

    public String getCrateBarcode() {
        return crateBarcode;
    }

    public void setCrateBarcode(String crateBarcode) {
        this.crateBarcode = crateBarcode;
    }

    public String getPalletBarcode() {
        return palletBarcode;
    }

    public void setPalletBarcode(String palletBarcode) {
        this.palletBarcode = palletBarcode;
    }

    public String getLocationBarcode() {
        return locationBarcode;
    }

    public void setLocationBarcode(String locationBarcode) {
        this.locationBarcode = locationBarcode;
    }

    public void setType(EntityType type) {
        this.type = type;
    }

    public EntityType getType() {
        return type;
    }
}
