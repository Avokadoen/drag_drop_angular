package no.nb.samo.model;

import java.util.Comparator;
import java.util.Objects;

public class StorageObject {
    private String nbId;
    private String organisationId;
    private String externalId;
    private String materialType;
    private String materialCondition;
    private String contractType;
    private String collectionTitle;
    private String notice;
    private String containerId;
    private String deliveryId;

    public StorageObject(String nbId, String organisationId, String externalId,
                         String materialType, String materialCondition,
                         String contractType, String collectionTitle, String notice,
                         String containerId, String deliveryId) {
        this.nbId = nbId;
        this.organisationId = organisationId;
        this.externalId = externalId;
        this.materialType = materialType;
        this.materialCondition = materialCondition;
        this.contractType = contractType;
        this.collectionTitle = collectionTitle;
        this.notice = notice;
        this.containerId = containerId;
        this.deliveryId = deliveryId;
    }

    StorageObject() {
    }

    public String getNbId() {
        return nbId;
    }

    public void setNbId(String nbId) {
        this.nbId = nbId;
    }

    public String getOrganisationId() {
        return organisationId;
    }

    public void setOrganisationId(String organisationId) {
        this.organisationId = organisationId;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getMaterialType() {
        return materialType;
    }

    public void setMaterialType(String materialType) {
        this.materialType = materialType;
    }

    public String getMaterialCondition() {
        return materialCondition;
    }

    public void setMaterialCondition(String materialCondition) {
        this.materialCondition = materialCondition;
    }

    public String getContractType() {
        return contractType;
    }

    public void setContractType(String contractType) {
        this.contractType = contractType;
    }

    public String getCollectionTitle() {
        return collectionTitle;
    }

    public void setCollectionTitle(String collectionTitle) {
        this.collectionTitle = collectionTitle;
    }

    public String getNotice() {
        return notice;
    }

    public void setNotice(String notice) {
        this.notice = notice;
    }

    public String getContainerId() {
        return containerId;
    }

    public void setContainerId(String containerId) {
        this.containerId = containerId;
    }

    public String getDeliveryId() {
        return deliveryId;
    }

    public void setDeliveryId(String deliveryId) {
        this.deliveryId = deliveryId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StorageObject that = (StorageObject) o;
        return nbId.equals(that.nbId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nbId);
    }

    public static class SortbyNbId implements Comparator<StorageObject>
    {
        // Used for sorting in ascending order of
        // roll number
        public int compare(StorageObject a, StorageObject b)
        {
            return a.getNbId().compareTo(b.getNbId());
        }
    }

    public static class SortbyOrganisationId implements Comparator<StorageObject>
    {
        // Used for sorting in ascending order of
        // roll number
        public int compare(StorageObject a, StorageObject b)
        {
            return a.getOrganisationId().compareTo(b.getOrganisationId());
        }
    }
}


