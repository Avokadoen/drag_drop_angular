package no.nb.samo.mocktidev.controller;

import no.nb.samo.mocktidev.model.Entity;
import no.nb.samo.mocktidev.model.EntityType;
import no.nb.samo.mocktidev.model.PlainEntity;
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
    public Entity create(@RequestParam String barcode, @RequestParam EntityType type, @RequestParam(required = false) Integer parentId) {
        PlainEntity newEntity = new PlainEntity(type, barcode, parentId);
        return entityService.create(newEntity);
    }

    @PutMapping("/move")
    public Entity move(@RequestParam Integer entityId, @RequestParam String newParentBarcode) {
        return entityService.updateParent(entityId, newParentBarcode);
    }

    @GetMapping("/get/{barcode}")
    public Entity get(@PathVariable String barcode) {
        return entityService.getEntityByBarcode(barcode);
    }

}
