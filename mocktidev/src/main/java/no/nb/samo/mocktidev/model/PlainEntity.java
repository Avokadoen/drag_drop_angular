package no.nb.samo.mocktidev.model;


public class PlainEntity {
    private EntityType type;
    private String barcode;
    private Integer parentId;

    public PlainEntity() {
    }

    public PlainEntity(EntityType type, String barcode, Integer parentId) {
        this.type = type;
        this.barcode = barcode;
        this.parentId = parentId;
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

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }
}
