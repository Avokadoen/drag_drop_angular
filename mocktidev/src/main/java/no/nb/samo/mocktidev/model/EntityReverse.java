package no.nb.samo.mocktidev.model;

import java.util.ArrayList;

public class EntityReverse {
    private String barcode;
    private int entityType;
    private ArrayList<EntityReverse> children;

    public EntityReverse() {
    }

    public EntityReverse(EntityType type, String barcode) {
        this.entityType = type.ordinal();
        this.barcode = barcode;
        children = new ArrayList<>();
    }

    public EntityReverse(Entity entity) {
        this.entityType = entity.getType().ordinal();
        this.barcode = entity.getBarcode();
        children = new ArrayList<>();
    }

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

    public ArrayList<EntityReverse> getChildren() {
        return children;
    }

    public void setChildren(ArrayList<EntityReverse> children) {
        this.children = children;
    }

    public void addChild(EntityReverse entityReverse) {
        children.add(entityReverse);
    }
}
