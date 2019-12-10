package no.nb.samo.model;

public class EntityMove {
    String barcode;
    String newParentBarcode;

    public EntityMove() {
    }

    public EntityMove(String barcode, String newParentBarcode) {
        this.barcode = barcode;
        this.newParentBarcode = newParentBarcode;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getNewParentBarcode() {
        return newParentBarcode;
    }

    public void setNewParentBarcode(String newParentBarcode) {
        this.newParentBarcode = newParentBarcode;
    }
}
