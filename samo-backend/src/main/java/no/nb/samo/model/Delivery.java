package no.nb.samo.model;

import java.util.List;

public class Delivery {
    private String deliveryId;
    private int objectCount;

    private List<StorageObject> storageObjects;

    public Delivery(String deliveryId, int objectCount, List<StorageObject> storageObjects) {
        this.deliveryId = deliveryId;
        this.objectCount = objectCount;
        this.storageObjects = storageObjects;
    }

    public String getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(String deliveryId) {
        this.deliveryId = deliveryId;
    }

    public int getObjectCount() {
        return objectCount;
    }

    public void setObjectCount(int objectCount) {
        this.objectCount = objectCount;
    }

    public List<StorageObject> getStorageObjects() {
        return storageObjects;
    }

    public void setStorageObjects(List<StorageObject> storageObjects) {
        this.storageObjects = storageObjects;
    }
}
