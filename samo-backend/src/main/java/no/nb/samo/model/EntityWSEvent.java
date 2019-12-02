package no.nb.samo.model;

public class EntityWSEvent {
    Integer timestamp;
    String movingBarcode;
    String previousParentBarcode;
    String newParentBarcode;
    int currentIndex;
    int targetIndex;

    public Integer getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Integer timestamp) {
        this.timestamp = timestamp;
    }

    public String getMovingBarcode() {
        return movingBarcode;
    }

    public void setMovingBarcode(String movingBarcode) {
        this.movingBarcode = movingBarcode;
    }

    public String getPreviousParentBarcode() {
        return previousParentBarcode;
    }

    public void setPreviousParentBarcode(String previousParentBarcode) {
        this.previousParentBarcode = previousParentBarcode;
    }

    public String getNewParentBarcode() {
        return newParentBarcode;
    }

    public void setNewParentBarcode(String newParentBarcode) {
        this.newParentBarcode = newParentBarcode;
    }

    public int getCurrentIndex() {
        return currentIndex;
    }

    public void setCurrentIndex(int currentIndex) {
        this.currentIndex = currentIndex;
    }

    public int getTargetIndex() {
        return targetIndex;
    }

    public void setTargetIndex(int newIndex) {
        this.targetIndex = newIndex;
    }
}
