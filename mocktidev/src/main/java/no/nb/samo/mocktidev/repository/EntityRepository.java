package no.nb.samo.mocktidev.repository;

import no.nb.samo.mocktidev.model.Entity;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface EntityRepository extends PagingAndSortingRepository<Entity, Integer> {
    Optional<Entity> findByBarcode(String barcode);
}
