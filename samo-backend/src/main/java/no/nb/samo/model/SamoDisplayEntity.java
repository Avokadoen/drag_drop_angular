package no.nb.samo.model;

public class SamoDisplayEntity {
    private String barcode;
    private int entityType;
    private SamoDisplayEntity[] children;

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public int getEntityType() {
        return entityType;
    }

    public void setEntityType(int entityType) {
        this.entityType = entityType;
    }

    public SamoDisplayEntity[] getChildren() {
        return children;
    }

    public void setChildren(SamoDisplayEntity[] children) {
        this.children = children;
    }
}
