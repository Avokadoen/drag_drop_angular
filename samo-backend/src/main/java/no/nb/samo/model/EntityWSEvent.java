package no.nb.samo.model;

public class EntityWSEvent {
    Integer timestamp;
    EntityMeta source;
    String newParentBarcode;
    String currentParentBarcode;
    boolean wasUndoEvent;

    public Integer getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Integer timestamp) {
        this.timestamp = timestamp;
    }

    public EntityMeta getSource() {
        return source;
    }

    public void setSource(EntityMeta source) {
        this.source = source;
    }

    public String getNewParentBarcode() {
        return newParentBarcode;
    }

    public void setNewParentBarcode(String newParentBarcode) {
        this.newParentBarcode = newParentBarcode;
    }

    public String getCurrentParentBarcode() {
        return currentParentBarcode;
    }

    public void setCurrentParentBarcode(String currentParentBarcode) {
        this.currentParentBarcode = currentParentBarcode;
    }

    public boolean isWasUndoEvent() {
        return wasUndoEvent;
    }

    public void setWasUndoEvent(boolean wasUndoEvent) {
        this.wasUndoEvent = wasUndoEvent;
    }
}
