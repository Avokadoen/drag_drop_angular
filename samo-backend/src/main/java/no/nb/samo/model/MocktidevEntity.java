package no.nb.samo.model;


public class MocktidevEntity {
    private EntityType type;
    private String barcode;
    private String parentBarcode;

    public MocktidevEntity() {
    }

    public MocktidevEntity(EntityType type, String barcode, String parentBarcode) {
        this.type = type;
        this.barcode = barcode;
        this.parentBarcode = parentBarcode;
    }

    public EntityType getType() {
        return type;
    }

    public void setType(EntityType type) {
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
}
