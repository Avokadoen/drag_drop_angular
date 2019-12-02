package no.nb.samo.model;

public class StorageEntity {
    String barcode;
    StorageEntity[] children;
    int entityType;

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public StorageEntity[] getChildren() {
        return children;
    }

    public void setChildren(StorageEntity[] children) {
        this.children = children;
    }

    public int getEntityType() {
        return entityType;
    }

    public void setEntityType(int entityType) {
        this.entityType = entityType;
    }
}
