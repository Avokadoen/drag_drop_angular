package no.nb.samo.mocktidev.model;

public class EntityCreate {
    String barcode;
    String parentBarcode;
    int type;

    public EntityCreate() {
    }

    public EntityCreate(String barcode, String parentBarcode, int type) {
        this.barcode = barcode;
        this.parentBarcode = parentBarcode;
        this.type = type;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getParentBarcode() {
        return parentBarcode;
    }

    public void setParentBarcode(String parentBarcode) {
        this.parentBarcode = parentBarcode;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
