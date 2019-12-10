package no.nb.samo.mocktidev.controller;

import no.nb.samo.mocktidev.model.*;
import no.nb.samo.mocktidev.service.EntityService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class MocktidevController {

    private final EntityService entityService;

    public MocktidevController(EntityService entityService) {
        this.entityService = entityService;
    }

    @PostMapping("/create")
    public void create(@RequestBody EntityCreate entity) {
        entityService.create(entity);
    }

    @PostMapping("/move")
    public Entity move(@RequestBody EntityMove entityMove) {
        return entityService.updateParent(entityMove.getBarcode(), entityMove.getNewParentBarcode());
    }

    @DeleteMapping("/delete/{barcode}")
    public void delete(@PathVariable String barcode) {
        entityService.delete(barcode);
    }

    @GetMapping("/get/{barcode}")
    public Entity get(@PathVariable String barcode) {
        return entityService.getEntityByBarcode(barcode);
    }

    @GetMapping("/get_with_children/{barcode}")
    public EntityReverse getWithChildren(@PathVariable String barcode) {
        return entityService.getEntityWithChildren(barcode);
    }
}
