package no.nb.samo.mocktidev.service;

import no.nb.samo.mocktidev.exception.InvalidRequestException;
import no.nb.samo.mocktidev.exception.UnreachableException;
import no.nb.samo.mocktidev.model.Entity;
import no.nb.samo.mocktidev.model.EntityType;
import no.nb.samo.mocktidev.model.FlattenedEntity;
import no.nb.samo.mocktidev.model.PlainEntity;
import no.nb.samo.mocktidev.repository.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class EntityService {

    private final EntityRepository entityRepository;

    public EntityService(EntityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    public Entity getEntityByBarcode(String barcode) {
        validateBarcode(barcode);
        if (barcode.isEmpty()) {
            throw new InvalidRequestException("Can't use empty string for barcode");
        }

        return entityRepository.findByBarcode(barcode)
                .orElseThrow(() -> new InvalidRequestException(MessageFormat.format("Could not find entity with barcode: {0}", barcode)));
    }

    public Page<FlattenedEntity> flattenEntities(PageRequest pageRequest, String query) {
        List<FlattenedEntity> flattenedEntityList = new ArrayList<>();
        for (Entity e : entityRepository.findAll()) {
            FlattenedEntity flattenedEntity = new FlattenedEntity(e.getId());
            flattenedEntity.setType(e.getType());
            while (e != null) {
                switch (e.getType()) {
                    case OBJECT:
                        flattenedEntity.setObjectBarcode(e.getBarcode());
                        break;
                    case BOX:
                        flattenedEntity.setBoxBarcode(e.getBarcode());
                        break;
                    case CRATE:
                        flattenedEntity.setCrateBarcode(e.getBarcode());
                        break;
                    case PALLET:
                        flattenedEntity.setPalletBarcode(e.getBarcode());
                        break;
                    case LOCATION:
                        flattenedEntity.setLocationBarcode(e.getBarcode());
                        break;
                    default:
                        throw new UnreachableException();
                }
                e = e.getParent();
            }
            if (flattenedEntityContainsQuery(flattenedEntity, query)) {
                flattenedEntityList.add(flattenedEntity);
            }
        }

        List<FlattenedEntity> pagedEntities = new ArrayList<>(pageRequest.getPageSize());
        for (long i = pageRequest.getOffset(); i < pageRequest.getOffset() + pageRequest.getPageSize(); i++) {
            if (i < flattenedEntityList.size()) {
                pagedEntities.add(flattenedEntityList.get((int)i));
            }
        }

        return new PageImpl<>(pagedEntities, pageRequest, flattenedEntityList.size());
    }

    public Entity updateParent(int entityId, String newParentBarcode) {
        validateBarcode(newParentBarcode);

        Entity workingEntity = entityRepository
                .findById(entityId)
                .orElseThrow(() -> new InvalidRequestException(MessageFormat.format("Could not find requested entity with id {0}", entityId)));

        Optional<Entity> parentEntity = entityRepository.findByBarcode(newParentBarcode);

        if (parentEntity.isPresent()) {
            if (parentEntity.get().getType().ordinal() <= workingEntity.getType().ordinal()) {
                throw new InvalidRequestException(MessageFormat.format("Invalid type relation: {0} cannot be parent of {1}", parentEntity.get().getType(), workingEntity.getType()));
            }
            // fallthrough
        } else if (workingEntity.getType() != EntityType.LOCATION){
            throw new InvalidRequestException("Entity must have a location!");
        } else {
            throw new InvalidRequestException("Entity must have a parent!");
        }

        workingEntity.setParent(parentEntity.get());

        if (hasLocation(workingEntity)) {
            entityRepository.save(workingEntity);
        } else {
            throw new InvalidRequestException("New entity is missing a location!");
        }

        return workingEntity;
    }

    public void delete(int entityId) {
        long count = StreamSupport.stream(entityRepository.findAll().spliterator(), false)
                .filter(e -> (e.getParent() != null && e.getParent().getId().equals(entityId)))
                .count();
        if (count > 0) {
            throw new InvalidRequestException("Can't delete entity with children");
        }
        entityRepository.deleteById(entityId);
    }
    
    public Entity create(PlainEntity plainEntity) {
        validateBarcode(plainEntity.getBarcode());

        Entity entity = Optional.ofNullable(plainEntity.getParentId())
                .map(i -> getParentIfValid(i, plainEntity.getType()))
                .map(p -> new Entity(plainEntity.getType(), plainEntity.getBarcode(), p))
                .orElseGet(() -> new Entity(plainEntity.getType(), plainEntity.getBarcode()));

        if (!hasLocation(entity)) {
            throw new InvalidRequestException("New entity is missing a location!");
        }
        entityRepository.save(entity);

        return entity;
    }

    private boolean hasLocation(Entity entity) {
        boolean hasLocation = entity.getType() == EntityType.LOCATION;
        Entity e = entity.getParent();
        while (e != null) {
            hasLocation = e.getType() == EntityType.LOCATION;
            e = e.getParent();
        }

        return hasLocation;
    }

    private void validateBarcode(String barcode) {
        if (barcode.length() > 40) {
            throw new InvalidRequestException("Barcode can only be 40 characters long");
        }
    }

    private Entity getParentIfValid(int parentId, EntityType childType) {
        Entity parent = entityRepository.findById(parentId).orElseThrow(() -> new InvalidRequestException(MessageFormat.format("Failed to find entity with id: {0}", parentId)));
        if (parent.getType().ordinal() <= childType.ordinal()) {
            throw new InvalidRequestException(MessageFormat.format("Invalid type relation: {0} cannot be parent of {1}", parent.getType(), childType));
        }

        return parent;
    }

    private boolean flattenedEntityContainsQuery(FlattenedEntity f, String q) {
        if (q == null || q.isEmpty()) {
            return true;
        }

        if (f.getLocationBarcode().equalsIgnoreCase(q)) {
            return true;
        }
        if (checkStringField(f.getPalletBarcode(), q)) {
            return true;
        }
        if (checkStringField(f.getCrateBarcode(), q)) {
            return true;
        }
        if (checkStringField(f.getBoxBarcode(), q)) {
            return true;
        }
        if (checkStringField(f.getObjectBarcode(), q)) {
            return true;
        }

        return f.getType().name().equalsIgnoreCase(q);
    }

    private boolean checkStringField(String field, String q) {
        if (field == null || field.isEmpty()) {
            return false;
        }

        return field.equalsIgnoreCase(q);
    }
}
